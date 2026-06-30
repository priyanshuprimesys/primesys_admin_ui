import axios from "axios";
import axiosApi from "../../../../utils/axiosInstance/AxiosConfig";
import {
    DeviceInfo,
    ServerAction,
    ServerControlResult,
    Sim,
    SimProvider,
    SimUploadResult,
    WhitelistEntry,
    WhitelistQueryParams,
} from "./schema";

/**
 * GET /v2/whitelist?deviceImei=<imei>&status=<status?>
 *
 * Returns the SOS whitelist entries for a device, newest-first.
 * `status` is optional — when omitted, all statuses are returned.
 * Auth (ADMIN / SUB_ADMIN Bearer token) is attached by the axios instance.
 */
export async function fetchWhitelist(
    params: WhitelistQueryParams = {}
): Promise<WhitelistEntry[]> {
    try {
        const response = await axiosApi.get("/v2/whitelist", {
            params: {
                ...(params.status ? { status: params.status } : {}),
            },
        });

        const payload = response.data;

        // Normalise across the possible envelope shapes the service may return.
        const list = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.data?.result)
                    ? payload.data.result
                    : Array.isArray(payload?.result)
                        ? payload.result
                        : [];

        return list as WhitelistEntry[];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch whitelist entries"
            );
        }
        throw new Error("Unexpected Error");
    }
}

/**
 * POST /v1/sim/upload?simProvider=<provider>&createdBy=<createdBy>
 *
 * Uploads a SIM batch file (.csv / .xlsx / .xls) for the given provider.
 * The file is sent as multipart/form-data under the field name `file`.
 * The endpoint upserts on sim_no, so re-uploading the same file returns
 * `inserted: 0` with the rows counted under `updated`.
 */
export async function uploadSim(
    provider: SimProvider,
    file: File,
    createdBy = "admin"
): Promise<SimUploadResult> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosApi.post("/v1/sim/upload", formData, {
            params: { simProvider: provider, createdBy },
        });

        // Envelope: { success, data: { result: { inserted, updated, ... } } }.
        // Fall back through the less-nested shapes in case the service changes.
        const body = response.data ?? {};
        const result = body?.data?.result ?? body?.data ?? body?.result ?? body;
        return {
            inserted: Number(result?.inserted ?? 0),
            updated: Number(result?.updated ?? 0),
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                `Failed to upload ${provider} SIM file`
            );
        }
        throw new Error("Unexpected Error");
    }
}

/**
 * PATCH /v2/whitelist/device/{deviceImei}/status
 *
 * Flips every whitelist entry for a device (its FN + SOS rows) to the given
 * status. Keyed by device IMEI, so one call updates the whole merged record.
 */
export async function updateWhitelistStatus(
    deviceImei: string | number,
    status: "COMPLETED" | "PENDING" = "COMPLETED",
    updatedBy = "admin"
): Promise<void> {
    try {
        await axiosApi.patch(`/v2/whitelist/device/${deviceImei}/status`, {
            status,
            updatedBy,
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to update whitelist status"
            );
        }
        throw new Error("Unexpected Error");
    }
}

// The OTP endpoints are public/pre-auth: sending a Bearer token makes the JWT
// filter reject the request with 401. So these use a plain axios call (no token)
// with the env base URL, rather than the authenticated axiosApi instance.
const OTP_BASE = import.meta.env.VITE_ADMIN_API_URL ?? "";

/**
 * POST /api/v1/auth/generate-otp?userId=<userId>
 * Sends an OTP to the user's registered email/mobile. No auth header.
 */
export async function generateOtp(userId: string): Promise<void> {
    try {
        await axios.post(
            `${OTP_BASE}/api/v1/auth/generate-otp?userId=${encodeURIComponent(userId)}`
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to send OTP"
            );
        }
        throw new Error("Unexpected Error");
    }
}

/**
 * POST /api/v1/auth/verify-otp?userId=<userId>&otp=<otp>
 * Returns true only when the OTP is valid (response.success === true). No auth header.
 */
export async function verifyOtp(userId: string, otp: string): Promise<boolean> {
    try {
        const response = await axios.post(
            `${OTP_BASE}/api/v1/auth/verify-otp?userId=${encodeURIComponent(
                userId
            )}&otp=${encodeURIComponent(otp)}`
        );
        return response.data?.success === true;
    } catch (error: unknown) {
        // A wrong/expired OTP comes back as 400/404 with success:false — not a
        // network failure, so report it as "not verified" rather than throwing.
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data?.success === true;
        }
        throw new Error("Unexpected Error");
    }
}

/**
 * POST /v2/server/erlang-control { action: "START" | "STOP" }
 *
 * Runs the fixed erlang server start/stop script on the host. The script path
 * is resolved server-side from the action — the client only sends START/STOP.
 */
export async function controlErlangServer(
    action: ServerAction
): Promise<ServerControlResult> {
    try {
        const response = await axiosApi.post("/v2/server/erlang-control", {
            action,
        });
        // Backend may return { success:false, error:{ message } } with a 200.
        if (response.data?.success === false) {
            throw new Error(
                response.data?.error?.message ||
                `Failed to ${action.toLowerCase()} server`
            );
        }
        // HttpApiResponse → Result<T> nests the payload under data.result.
        const result =
            response.data?.data?.result ??
            response.data?.result ??
            response.data ??
            {};
        return {
            status: String(result.status ?? "OK"),
            output: String(result.output ?? ""),
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                `Failed to ${action.toLowerCase()} server`
            );
        }
        // Preserve the message from the success:false throw above.
        if (error instanceof Error) throw error;
        throw new Error("Unexpected Error");
    }
}

/**
 * GET /v1/sim?simProvider=<provider?>
 *
 * Returns SIM records (simNo / mobileNumber / imei / …). Used to resolve a
 * device's MOBILE_NUMBER by IMEI when preparing the Airtel whitelist sheet.
 */
export async function fetchSims(provider?: SimProvider): Promise<Sim[]> {
    try {
        const response = await axiosApi.get("/v1/sim", {
            params: provider ? { simProvider: provider } : {},
        });

        const payload = response.data;
        const list = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.data?.result)
                    ? payload.data.result
                    : [];

        return list as Sim[];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch SIM records"
            );
        }
        throw new Error("Unexpected Error");
    }
}

/**
 * GET /v2/device/device-info-full?deviceImei=<imei>
 *
 * Returns the device's `deviceInfo` (deviceSimNo = mobile number, deviceSimImeiNo
 * = SIM ICCID). Used to resolve a whitelist device's mobile/SIM for the Airtel
 * sheet. Returns null on failure so a single bad device doesn't abort the batch.
 */
export async function fetchDeviceInfo(
    deviceImei: string | number
): Promise<DeviceInfo | null> {
    // deviceImei=0/empty returns 401 from this endpoint (no such device), which
    // would trip the axios 401→refresh→logout path. Skip the call entirely.
    if (!deviceImei || Number(deviceImei) <= 0) return null;
    try {
        const response = await axiosApi.get("/v2/device/device-info-full", {
            params: { deviceImei },
        });
        const result = response.data?.data?.result ?? response.data?.result;
        return (result?.deviceInfo ?? null) as DeviceInfo | null;
    } catch {
        return null;
    }
}
