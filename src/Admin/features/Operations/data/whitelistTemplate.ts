import Exceljs from "exceljs";

import {
    DeviceInfo,
    DeviceSimResolution,
    MergedWhitelistEntry,
    PROVIDER_ADMIN_NUMBER,
    Sim,
} from "./schema";

const digitsOnly = (value?: string): string => (value ?? "").replace(/\D/g, "");

/**
 * Resolve a device's SIM details (mobileNumber / basketName / imsi) per IMEI.
 * MOBILE_NUMBER is the device's deviceSimNo (from the device API). The SIM
 * record is matched first on ICCID (deviceSimImeiNo → Sim.simNo) and falls back
 * to mobile number, since the SIM's stored mobileNumber is sometimes corrupted
 * to scientific notation and won't match.
 */
export function buildDeviceSimResolution(
    deviceInfoByImei: Map<string, DeviceInfo | null>,
    sims: Sim[]
): Map<string, DeviceSimResolution> {
    const simBySimNo = new Map<string, Sim>();
    const simByMobile = new Map<string, Sim>();
    for (const sim of sims) {
        if (sim.simNo) simBySimNo.set(digitsOnly(sim.simNo), sim);
        if (sim.mobileNumber) simByMobile.set(digitsOnly(sim.mobileNumber), sim);
    }

    const resolution = new Map<string, DeviceSimResolution>();
    for (const [imei, info] of deviceInfoByImei) {
        const mobileNumber = info?.deviceSimNo ?? "";
        const iccid = digitsOnly(info?.deviceSimImeiNo);
        const sim =
            (iccid && simBySimNo.get(iccid)) ||
            (mobileNumber && simByMobile.get(digitsOnly(mobileNumber))) ||
            undefined;
        resolution.set(imei, {
            mobileNumber,
            basketName: sim?.basketName ?? "",
            imsi: sim?.simImsi ?? "",
        });
    }
    return resolution;
}

const COUNTRY_CODE = "+91";
const WHITELIST_TYPE = "INCOMING & OUTGOING";
const REMAINING_ORDER_COUNT = 5;
const SLOTS = 4;

/** Header style shared by both provider sheets. */
const styleHeader = (sheet: Exceljs.Worksheet, lastColLetter: string) => {
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A202C" } };
    header.alignment = { vertical: "middle", horizontal: "center" };
    header.height = 20;
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.autoFilter = { from: "A1", to: `${lastColLetter}1` };
};

/** User SOS numbers for a device (admin/gateway numbers excluded). */
const userNumbers = (entry: MergedWhitelistEntry): string[] =>
    entry.contacts.filter((c) => !c.isAdmin).map((c) => c.number);

/** Pad/trim an array to exactly `length`, filling the gaps with "". */
const fit = (values: string[], length: number): string[] =>
    Array.from({ length }, (_, i) => values[i] ?? "");

const triggerDownload = async (workBook: Exceljs.Workbook, fileName: string) => {
    const data = await workBook.xlsx.writeBuffer();
    const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
};

/**
 * Trigger a browser download for an in-memory CSV string.
 * Data fields are quoted text; columns in `excelTextCols` use the Excel
 * ="value" form so long numbers (e.g. 15-digit imsi) aren't shown/saved in
 * scientific notation. The header row (row 0) is left unquoted.
 */
const triggerCsvDownload = (
    rows: string[][],
    fileName: string,
    excelTextCols: number[] = []
) => {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const cell = (value: string, col: number) =>
        excelTextCols.includes(col) ? `="${value.replace(/"/g, '""')}"` : quote(value);
    // Trailing \r\n terminates the last row so parsers don't drop it.
    const csv =
        rows
            .map((r, i) => (i === 0 ? r.join(",") : r.map(cell).join(",")))
            .join("\r\n") + "\r\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
};

const stamp = (): string =>
    new Date().toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });

/** Number groups repeated across the Jio sheet: incoming/outgoing call & sms. */
const JIO_GROUPS = ["ic", "oc", "is", "os"] as const;

/**
 * Jio whitelist template (image): imsi, then ic1-4 / oc1-4 / is1-4 / os1-4.
 * `imsi` comes from the matched SIM record. Number slots 1-3 hold the user SOS
 * numbers and slot 4 the Jio admin number; the same four numbers repeat across
 * every group. Exported as CSV (Jio expects CSV, not Excel).
 */
export async function exportJioWhitelist(
    entries: MergedWhitelistEntry[],
    resolutionByImei: Map<string, DeviceSimResolution>
): Promise<void> {
    const header = [
        "imsi",
        ...JIO_GROUPS.flatMap((g) => [1, 2, 3, 4].map((i) => `${g}${i}`)),
    ];

    const rows: string[][] = [header];
    entries.forEach((entry) => {
        const users = fit(userNumbers(entry), SLOTS - 1);
        const numbers = [...users, PROVIDER_ADMIN_NUMBER.jio];
        const resolved = resolutionByImei.get(String(entry.device_imei));

        // imsi is digits-only; the number columns get a "91" country-code prefix.
        const line = [digitsOnly(resolved?.imsi ?? "")];
        JIO_GROUPS.forEach(() => {
            numbers.forEach((number) => {
                // Empty number slots are backfilled with the Jio admin number.
                const n = digitsOnly(number) || PROVIDER_ADMIN_NUMBER.jio;
                line.push(`91${n}`);
            });
        });
        rows.push(line);
    });

    triggerCsvDownload(rows, `JioWhitelist_${stamp()}.csv`);
}

/**
 * Airtel whitelist template (image 1): MOBILE_NUMBER, BASKET_NAME, then four
 * sets of (COUNTRY_CODE, NUMBER, TYPE), then REMAINING_ORDER_COUNT.
 * The Airtel admin number takes slot 1; the user SOS numbers follow in 2-4.
 * MOBILE_NUMBER / BASKET_NAME are pre-resolved per device (IMEI → device API →
 * SIM API) and passed in keyed by device IMEI.
 */
export async function exportAirtelWhitelist(
    entries: MergedWhitelistEntry[],
    resolutionByImei: Map<string, DeviceSimResolution>
): Promise<void> {
    const workBook = new Exceljs.Workbook();
    workBook.creator = "Primesys Admin";
    workBook.created = new Date();

    const sheet = workBook.addWorksheet("Airtel Whitelist");

    const columns: Partial<Exceljs.Column>[] = [
        { header: "MOBILE_NUMBER", key: "mobile", width: 18 },
        { header: "BASKET_NAME", key: "basket", width: 20 },
    ];
    for (let i = 1; i <= SLOTS; i++) {
        columns.push(
            { header: `WHITELIST_COUNTRY_CODE${i}`, key: `cc${i}`, width: 22 },
            { header: `WHITELISTING_NUMBER${i}`, key: `num${i}`, width: 20 },
            { header: `WHITELISTING_TYPE_NUMBER${i}`, key: `type${i}`, width: 26 }
        );
    }
    columns.push({ header: "REMAINING_ORDER_COUNT", key: "remaining", width: 22 });
    sheet.columns = columns;

    entries.forEach((entry) => {
        const resolved = resolutionByImei.get(String(entry.device_imei));
        const users = fit(userNumbers(entry), SLOTS - 1);
        const numbers = [PROVIDER_ADMIN_NUMBER.airtel, ...users];

        // MOBILE_NUMBER from the device API; BASKET_NAME from the matched SIM.
        const row: Record<string, string | number> = {
            mobile: resolved?.mobileNumber ?? "",
            basket: resolved?.basketName ?? "",
            remaining: REMAINING_ORDER_COUNT,
        };
        for (let slot = 1; slot <= SLOTS; slot++) {
            // Country code and type are always required; an empty number slot
            // is backfilled with the Airtel admin number.
            row[`cc${slot}`] = COUNTRY_CODE;
            row[`num${slot}`] = numbers[slot - 1] || PROVIDER_ADMIN_NUMBER.airtel;
            row[`type${slot}`] = WHITELIST_TYPE;
        }

        sheet.addRow(row);
    });

    styleHeader(sheet, "Q");
    await triggerDownload(workBook, `AirtelWhitelist_${stamp()}.xlsx`);
}
