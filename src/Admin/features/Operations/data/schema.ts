export type WhitelistStatus = "PENDING" | "APPROVED" | "REJECTED";

export const WHITELIST_STATUS_OPTIONS: WhitelistStatus[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
];

/**
 * A single SOS whitelist entry returned by GET /v2/whitelist.
 * `command` holds the raw device command, e.g.
 *   "FN,A,PAPA,9762554098,MUMMY,9762554098,UNCLE,9762554098"
 */
export interface WhitelistEntry {
    id: string;
    device_imei: number;
    device_name: string;
    command_type: string;
    command: string;
    sim_provider: string;
    parent_id: number;
    login_name: string;
    status: WhitelistStatus | string;
    created_at: number;
}

export interface WhitelistQueryParams {
    status?: WhitelistStatus;
}

export interface SosContact {
    name: string;
    number: string;
    /** True when this is one of our provider admin/gateway numbers. */
    isAdmin: boolean;
}

/**
 * Provider admin numbers appended to every SOS command's last slot. These are
 * our own gateway numbers (not user contacts) — kept in the list but flagged so
 * the UI can show them with a distinct style.
 */
export const ADMIN_SOS_NUMBERS = new Set<string>(["9209253678", "9766711066"]);

const normalizeNumber = (value: string): string => value.replace(/\D/g, "");

const isPhoneNumber = (token: string): boolean => {
    const digits = normalizeNumber(token);
    return digits.length >= 10 && digits.length <= 13;
};

const isAdminNumber = (number: string): boolean => {
    const digits = normalizeNumber(number);
    // Match on the trailing 10 digits to ignore any country-code prefix.
    return ADMIN_SOS_NUMBERS.has(digits) || ADMIN_SOS_NUMBERS.has(digits.slice(-10));
};

/**
 * A device's whitelist rows (e.g. an FN row and an SOS row) collapsed into a
 * single record. `command_types` keeps every original type, and `contacts`
 * holds the union of contact numbers across those rows, de-duplicated.
 */
export interface MergedWhitelistEntry {
    id: string;
    device_imei: number;
    device_name: string;
    command_types: string[];
    contacts: SosContact[];
    sim_provider: string;
    login_name: string;
    status: WhitelistStatus | string;
    created_at: number;
}

/**
 * Group whitelist rows by device and merge their SOS contacts into one record.
 * Numbers are de-duplicated (first-seen name wins), FN + SOS types are kept,
 * and the most recent row supplies the representative status/timestamp.
 */
export function mergeWhitelistEntries(
    entries: WhitelistEntry[]
): MergedWhitelistEntry[] {
    const groups = new Map<string, MergedWhitelistEntry>();
    const seenNumbers = new Map<string, Set<string>>();

    for (const entry of entries) {
        const key = String(entry.device_imei ?? entry.id);
        let group = groups.get(key);

        if (!group) {
            group = {
                id: entry.id,
                device_imei: entry.device_imei,
                device_name: entry.device_name,
                command_types: [],
                contacts: [],
                sim_provider: entry.sim_provider,
                login_name: entry.login_name,
                status: entry.status,
                created_at: entry.created_at,
            };
            groups.set(key, group);
            seenNumbers.set(key, new Set());
        }

        if (
            entry.command_type &&
            !group.command_types.includes(entry.command_type)
        ) {
            group.command_types.push(entry.command_type);
        }

        const numbers = seenNumbers.get(key)!;
        for (const contact of parseSosContacts(entry.command)) {
            const dedupKey = normalizeNumber(contact.number);
            if (!numbers.has(dedupKey)) {
                numbers.add(dedupKey);
                group.contacts.push(contact);
            }
        }

        // Keep the newest row's status/timestamp as the record's representative.
        if ((entry.created_at ?? 0) > (group.created_at ?? 0)) {
            group.created_at = entry.created_at;
            group.status = entry.status;
        }
    }

    return Array.from(groups.values());
}

/** SIM providers accepted by POST /v1/sim/upload (stored as sim_provider). */
export type SimProvider = "jio" | "airtel";

/** Provider gateway/admin number that occupies a fixed slot in each template. */
export const PROVIDER_ADMIN_NUMBER: Record<SimProvider, string> = {
    jio: "9209253678",
    airtel: "9766711066",
};

/** Normalise a row's free-text sim_provider (e.g. "JIO") to a lowercase SimProvider. */
export function normalizeProvider(value?: string): SimProvider | null {
    const lower = (value ?? "").trim().toLowerCase();
    if (lower === "jio") return "jio";
    if (lower === "airtel") return "airtel";
    return null;
}

/** A SIM record from GET /v1/sim, used to resolve a device's basket/mobile. */
export interface Sim {
    id?: string;
    simNo?: string;
    simImsi?: string;
    mobileNumber?: string;
    imei?: string;
    simProvider?: string;
    basketName?: string;
}

/**
 * `deviceInfo` slice of GET /v2/device/device-info-full. `deviceSimNo` is the
 * device's mobile number; `deviceSimImeiNo` is the SIM ICCID (matches Sim.simNo,
 * usually with a trailing letter to strip).
 */
export interface DeviceInfo {
    deviceSimNo?: string;
    deviceSimImeiNo?: string;
}

/** SIM details resolved for one device (IMEI → device API → SIM API). */
export interface DeviceSimResolution {
    mobileNumber: string;
    basketName: string;
    imsi: string;
}

/** Accepted upload file extensions for the SIM upload endpoint. */
export const SIM_UPLOAD_ACCEPT = ".csv,.xlsx,.xls";

/** Erlang server control action sent to POST /v2/server/erlang-control. */
export type ServerAction = "START" | "STOP";

/** Result of a server-control request. */
export interface ServerControlResult {
    status: string;
    output: string;
}

/**
 * Result returned by POST /v1/sim/upload. The endpoint upserts on sim_no,
 * so re-uploading the same file reports `updated` instead of `inserted`.
 */
export interface SimUploadResult {
    inserted: number;
    updated: number;
}

/**
 * Extract phone-number contacts from an SOS-style command, working for both
 * shapes:
 *   FN:  "FN,A,<name>,<number>,<name>,<number>,..."  (named pairs)
 *   SOS: "SOS,A,<number>,<number>,..."               (bare numbers)
 *
 * Any 10–13 digit token is treated as a number; a preceding alphabetic token
 * (e.g. PAPA, Num1) is attached as its name. Control flags (FN/SOS/A) are not
 * treated as names.
 */
export function parseSosContacts(command?: string): SosContact[] {
    if (!command) return [];

    const tokens = command
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    const contacts: SosContact[] = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (!isPhoneNumber(token)) continue;

        // Numbers only — no name labels.
        contacts.push({ name: "", number: token, isAdmin: isAdminNumber(token) });
    }
    return contacts;
}
