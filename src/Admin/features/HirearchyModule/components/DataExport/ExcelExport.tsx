import { IconComponents } from "../../../../../global/Icons/IconsStore"
import { IDivisionParentIdDetailInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface"
import Exceljs from "exceljs";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { getDesignation } from "../../hooks/getDesignation";

interface ExcelProps {
    hirerarchyData: IDivisionParentIdDetailInterface;
}

const getDeviceCount = (item: { device_imeis?: string[]; device_list?: string }): number => {
    if (Array.isArray(item.device_imeis)) {
        return item.device_imeis.filter(x => String(x).trim() !== '').length;
    }
    if (item.device_list) {
        return item.device_list.split(',').filter(x => x.trim() !== '').length;
    }
    return 0;
};

const DESIGNATION_COLORS: Record<number, string> = {
    1: "FFE8F4FD",  // Control - light blue
    2: "FFDBEAFE",  // DEN - indigo
    3: "FFF3E8FF",  // ADEN - purple
    4: "FFFFF8E1",  // PWAY - amber
    5: "FFFCE4EC",  // Jr PWAY - pink
};

const ExcelExport: React.FC<ExcelProps> = ({ hirerarchyData }) => {

    const exportExcelFile = () => {
        if (hirerarchyData.data.result.length < 2) {
            useErrorNotification("Please select parent");
            return;
        }

        const workBook = new Exceljs.Workbook();
        workBook.creator  = "Primesys Admin";
        workBook.created  = new Date();

        const sheet = workBook.addWorksheet("Hierarchy Data", {
            pageSetup: { fitToPage: true, orientation: "landscape" }
        });

        /* ── header row style ── */
        sheet.getRow(1).font  = { name: "Arial Black", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        sheet.getRow(1).fill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A202C" } };
        sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
        sheet.getRow(1).height = 22;

        sheet.columns = [
            { header: "#",               key: "idx",           width: 5  },
            { header: "Department Name", key: "name",          width: 28 },
            { header: "Designation",     key: "designation",   width: 14 },
            { header: "Email",           key: "username",      width: 32 },
            { header: "Password",        key: "password",      width: 18 },
            { header: "Mobile Number",   key: "mobile_no",     width: 16 },
            { header: "Short Name",      key: "short_name",    width: 14 },
            { header: "WhatsApp Group",  key: "whatsapp",      width: 24 },
            { header: "Status",          key: "status",        width: 10 },
            { header: "Device Count",    key: "device_count",  width: 14 },
        ];

        hirerarchyData.data.result.forEach((item, idx) => {
            const devCount    = getDeviceCount(item);
            const designation = getDesignation(item.dept_id);
            const isActive    = item.active_status;
            const bgColor     = DESIGNATION_COLORS[item.dept_id] ?? "FFFFFFFF";

            const row = sheet.addRow({
                idx:         idx + 1,
                name:        item.name,
                designation: designation,
                username:    item.username,
                password:    item.password,
                mobile_no:   item.mobile_no,
                short_name:  item.short_name ?? "",
                whatsapp:    item.whatsapp_group_name ?? "",
                status:      isActive ? "Active" : "Inactive",
                device_count: devCount,
            });

            /* row background by designation */
            row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };

            /* status cell color */
            const statusCell = row.getCell("status");
            statusCell.font  = { bold: true, color: { argb: isActive ? "FF276749" : "FFC53030" } };

            /* device count color */
            const devCell = row.getCell("device_count");
            devCell.font  = {
                bold: true,
                color: { argb: devCount === 0 ? "FFC53030" : devCount < 10 ? "FFB7791F" : "FF276749" }
            };

            row.alignment = { vertical: "middle" };
            row.height    = 18;
        });

        /* freeze header + auto-filter */
        sheet.views = [{ state: "frozen", ySplit: 1 }];
        sheet.autoFilter = { from: "A1", to: "J1" };

        workBook.xlsx.writeBuffer().then(data => {
            const blob   = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url    = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href  = url;
            anchor.download = `HirearchySheet${new Date().toLocaleDateString([], { day: '2-digit', month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" })}.xlsx`;
            anchor.click();
            useSuccessNotification("Excel downloaded");
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <button onClick={exportExcelFile} className="px-2 py-2 rounded" title="Export to Excel">
            {IconComponents.excelIcon}
        </button>
    );
};

export default ExcelExport;
