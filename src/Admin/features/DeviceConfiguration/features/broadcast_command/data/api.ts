import axios from "axios";
import axiosApi from "../../../../../../utils/axiosInstance/AxiosConfig";
import { AllDevice, CommandCatalogItem, DeviceCommandEntity } from "./schema";

const unwrap = <T>(payload: unknown): T[] => {
    const p = payload as Record<string, unknown>;
    const data = p?.data as Record<string, unknown> | undefined;
    const list = Array.isArray(payload)
        ? payload
        : Array.isArray(data?.result)
            ? data?.result
            : Array.isArray(data)
                ? data
                : [];
    return list as T[];
};

/** GET /v2/device/all-devices — every device, including its connection flag. */
export async function fetchAllDevices(): Promise<AllDevice[]> {
    try {
        const response = await axiosApi.get("/v2/device/all-devices");
        return unwrap<AllDevice>(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch devices"
            );
        }
        throw new Error("Unexpected Error");
    }
}

/** GET /v2/device-command — the predefined command catalog. */
export async function fetchCommandCatalog(): Promise<CommandCatalogItem[]> {
    try {
        const response = await axiosApi.get("/v2/device-command");
        return unwrap<CommandCatalogItem>(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch commands"
            );
        }
        throw new Error("Unexpected Error");
    }
}

/** Max devices per send-command request; large broadcasts are split into these. */
export const SEND_CHUNK_SIZE = 500;

/**
 * POST /v2/device-command/send-command — array, one entry per device.
 * Large recipient sets are sent in sequential chunks of SEND_CHUNK_SIZE so a
 * single request never carries thousands of entries. `onProgress` reports the
 * running count of entities sent so the UI can show progress.
 */
export async function sendDeviceCommands(
    entities: DeviceCommandEntity[],
    onProgress?: (sent: number, total: number) => void
): Promise<void> {
    try {
        for (let i = 0; i < entities.length; i += SEND_CHUNK_SIZE) {
            const chunk = entities.slice(i, i + SEND_CHUNK_SIZE);
            await axiosApi.post("/v2/device-command/send-command", chunk);
            onProgress?.(Math.min(i + chunk.length, entities.length), entities.length);
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to send command"
            );
        }
        throw new Error("Unexpected Error");
    }
}
