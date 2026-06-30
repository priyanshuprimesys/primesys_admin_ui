import ExcelJs from "exceljs";
import { Button } from "@chakra-ui/react";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { getDeviceTypeName } from "../../utils/getDeviceTypeName";

interface DivisionExcelProps {
    divisionDevicesData: any[] | undefined | null;
}

const TYPE_COLORS: Record<number, string> = {
    1: "FFE8F4FD",
    2: "FFF3E8FF",
    3: "FFFFF8E1",
    4: "FFFCE4EC",
    5: "FFE6FFFA",
    6: "FFEEF2FF",
    7: "FFFFF7ED",
};

const DivisionExcelExport: React.FC<DivisionExcelProps> = ({ divisionDevicesData }) => {

    const exportExcelFile = () => {
        if (!divisionDevicesData || divisionDevicesData.length === 0) {
            useErrorNotification("No data available to export");
            return;
        }

        const workBook = new ExcelJs.Workbook();
        workBook.creator = "Primesys Admin";
        workBook.created = new Date();

        const sheet = workBook.addWorksheet("Division Devices", {
            pageSetup: { fitToPage: true, orientation: "landscape" },
        });

        /* header row style */
        sheet.getRow(1).font      = { name: "Arial Black", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        sheet.getRow(1).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A202C" } };
        sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
        sheet.getRow(1).height    = 22;

        sheet.columns = [
            { header: "#",             key: "idx",          width: 5  },
            { header: "Device Name",   key: "deviceName",   width: 24 },
            { header: "IMEI No",       key: "deviceImei",   width: 20 },
            { header: "Sim No",        key: "deviceSimNo",  width: 16 },
            { header: "Sim IMEI",      key: "simImei",      width: 20 },
            { header: "Device Type",   key: "deviceType",   width: 16 },
            { header: "Device No.",    key: "deviceNo",     width: 12 },
            { header: "Division ID",   key: "divisionId",   width: 20 },
            { header: "Status",        key: "status",       width: 10 },
            { header: "Report Enable", key: "reportEnable", width: 14 },
        ];

        divisionDevicesData.forEach((item, idx) => {
            /* support both IAdminDevicesInterface and IDivisionSingleDeviceInterface shapes */
            const typeId    = item.deviceTypeId    ?? 0;
            const isActive  = item.active_status   ?? item.activeStatus ?? true;
            const imei      = item.deviceImei      ?? item.imeiNo       ?? "";
            const simNo     = item.deviceSimNo     ?? item.simNo        ?? "";
            const simImei   = item.deviceSimImeiNo ?? "";
            const name      = item.deviceName      ?? item.name         ?? "";
            const devNo     = item.deviceNo        ?? "";
            const divId     = item.divisionId      ?? "";
            const repEnable = item.reportEnable    ?? true;
            const bgColor   = TYPE_COLORS[typeId]  ?? "FFFFFFFF";

            const row = sheet.addRow({
                idx:          idx + 1,
                deviceName:   name,
                deviceImei:   imei,
                deviceSimNo:  simNo,
                simImei:      simImei,
                deviceType:   getDeviceTypeName(typeId) || `Type ${typeId}`,
                deviceNo:     devNo,
                divisionId:   divId,
                status:       isActive ? "Active" : "Inactive",
                reportEnable: repEnable ? "Yes" : "No",
            });

            row.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
            row.alignment = { vertical: "middle" };
            row.height    = 18;

            const statusCell = row.getCell("status");
            statusCell.font  = { bold: true, color: { argb: isActive ? "FF276749" : "FFC53030" } };
        });

        /* freeze header + auto-filter */
        sheet.views      = [{ state: "frozen", ySplit: 1 }];
        sheet.autoFilter = { from: "A1", to: "J1" };

        workBook.xlsx.writeBuffer().then(data => {
            const blob   = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url    = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href     = url;
            anchor.download = `DivisionDevices_${new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "2-digit" })}.xlsx`;
            anchor.click();
            useSuccessNotification("Excel downloaded");
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <Button onClick={exportExcelFile} className="!bg-white border-2 border-dark" title="Export to Excel">
            {IconComponents.excelIcon}
        </Button>
    );
};

export default DivisionExcelExport;
