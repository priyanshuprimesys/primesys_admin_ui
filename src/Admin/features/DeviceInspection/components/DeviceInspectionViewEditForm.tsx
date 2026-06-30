import { ChangeEvent, useEffect, useState } from "react";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import { IDeviceInspectionReport, IInspectionDevices } from "../data/schema";
import InspectionDeviceSearch from "./InspectionDeviceSearch";
import { IStudentDevice } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceInterface";
import { Button } from "@chakra-ui/react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { RiFileExcel2Line } from "react-icons/ri";
import { usePutDeviceInspectionMutation } from "../data/queryOptions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import Exceljs from "exceljs";

interface DeviceInspectionInterface {
    isOpen: boolean;
    onClose: () => void;
    device: IDeviceInspectionReport;
}

const CELL =
    "w-full text-sm px-2 py-1.5 border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition";

const DeviceInspectionViewEditForm: React.FC<DeviceInspectionInterface> = ({ isOpen, onClose, device }) => {
    const [parentId, setParentId] = useState<string>(device.divisionId);
    const [divisionName, setDivisionName] = useState<string>(device.divisionName);
    const [reportDate, setReportDate] = useState<Date | null>(new Date());
    const [devicesInspectionList, setDevicesInspectionList] = useState<IInspectionDevices[]>(device.devices);

    useEffect(() => {
        if (device.divisionId) {
            setParentId(device.divisionId);
            setDivisionName(device.divisionName);
            setReportDate(new Date(device.reportDate * 1000));
            setDevicesInspectionList(device.devices);
        }
    }, [device.divisionId]);

    const { mutate, isPending } = usePutDeviceInspectionMutation();
    const queryClient = useQueryClient();

    const updateField = <K extends keyof IInspectionDevices>(srNo: number, field: K, value: IInspectionDevices[K]) => {
        setDevicesInspectionList((prev) =>
            prev.map((x) => (x.srNo === srNo ? { ...x, [field]: value } : x))
        );
    };

    const onDeviceSelection = (item: IStudentDevice, indexNo: number) => {
        setDevicesInspectionList((prev) =>
            prev.map((x) =>
                x.srNo === indexNo ? { ...x, deviceName: item.name, imeiNumber: `${item.imeiNo}` } : x
            )
        );
    };

    const onHandleNewDevice = () => {
        const newSrNo =
            devicesInspectionList.length > 0
                ? Math.max(...devicesInspectionList.map((d) => d.srNo)) + 1
                : 1;
        setDevicesInspectionList((prev) => [
            ...prev,
            {
                srNo: newSrNo,
                deviceName: "",
                imeiNumber: "",
                issue: "",
                inspection: "",
                finalReport: "",
                remark: "",
                afterTested: "",
            },
        ]);
    };

    const onHandleDeleteDevice = (srNo: number) => {
        setDevicesInspectionList((prev) => prev.filter((x) => x.srNo !== srNo));
    };

    const onHandleSubmit = () => {
        if (!parentId || devicesInspectionList.length === 0) {
            toast.error("Please select a division and add at least one device.");
            return;
        }
        const request: IDeviceInspectionReport = {
            id: device.id,
            divisionId: parentId,
            divisionName,
            reportDate: Math.floor(new Date(reportDate ?? new Date()).getTime() / 1000),
            devices: devicesInspectionList,
        };
        mutate(request, {
            onSuccess: () => {
                toast.success("Inspection report updated successfully");
                queryClient.invalidateQueries({ queryKey: ["get-all-device-inspection-query-key"] });
                setTimeout(onClose, 900);
            },
        });
    };

    const handleExportExcel = async () => {
        if (devicesInspectionList.length === 0) {
            toast.error("No device data to export.");
            return;
        }
        const workbook = new Exceljs.Workbook();
        const sheet = workbook.addWorksheet("Inspection Report");
        const dateStr = reportDate
            ? reportDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "";

        sheet.mergeCells("A1:I1");
        const titleCell = sheet.getCell("A1");
        titleCell.value = `Device Inspection Report — ${divisionName || "Division"} | ${dateStr}`;
        titleCell.font = { name: "Arial", bold: true, size: 13, color: { argb: "FF0F1626" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0FE" } };
        sheet.getRow(1).height = 28;

        sheet.columns = [
            { header: "Sl No", key: "srNo", width: 8 },
            { header: "Device Name", key: "deviceName", width: 22 },
            { header: "IMEI Number", key: "imeiNumber", width: 22 },
            { header: "Issue", key: "issue", width: 30 },
            { header: "Inspection", key: "inspection", width: 30 },
            { header: "Final Report", key: "finalReport", width: 28 },
            { header: "Remark", key: "remark", width: 24 },
            { header: "After Tested", key: "afterTested", width: 20 },
        ];

        const headerRow = sheet.getRow(2);
        headerRow.font = { name: "Arial", bold: true, size: 10, color: { argb: "FFFFFFFF" } };
        headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E6FF2" } };
        headerRow.height = 20;
        headerRow.alignment = { horizontal: "center", vertical: "middle" };

        devicesInspectionList.forEach((item, i) => {
            const row = sheet.addRow({
                srNo: i + 1,
                deviceName: item.deviceName,
                imeiNumber: item.imeiNumber,
                issue: item.issue,
                inspection: item.inspection,
                finalReport: item.finalReport,
                remark: item.remark,
                afterTested: item.afterTested,
            });
            row.height = 18;
            row.font = { name: "Arial", size: 9 };
            row.alignment = { vertical: "middle", wrapText: true };
            if (i % 2 === 1) {
                row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F8FF" } };
            }
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "FFD1D5DB" } },
                    left: { style: "thin", color: { argb: "FFD1D5DB" } },
                    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
                    right: { style: "thin", color: { argb: "FFD1D5DB" } },
                };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `InspectionReport_${divisionName || "Division"}_${dateStr.replace(/ /g, "_")}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        toast.success("Excel exported successfully");
    };

    return (
        <ChakraUiModal isOpen={isOpen} modalSize="6xl" scroll onClose={onClose} modalHeader="Edit Inspection Report">
            <div className="flex flex-col gap-4 pb-4">

                {/* ── Header controls ── */}
                <div className="flex flex-wrap items-end gap-4 px-1 py-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1 min-w-[220px]">
                        <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Division</p>
                        <ParentDataSearchSelect
                            divisionId={parentId}
                            setParentName={setDivisionName}
                            setInputData={setParentId}
                            placeHolder="Search division..."
                        />
                    </div>
                    <div className="min-w-[160px]">
                        <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Report Date</p>
                        <DatePicker
                            selected={reportDate}
                            showTimeSelect={false}
                            dateFormat="dd/MM/yyyy"
                            className="py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-3 w-full text-sm text-center bg-white"
                            onChange={(date) => setReportDate(date)}
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 whitespace-nowrap">
                            {devicesInspectionList.length} device{devicesInspectionList.length !== 1 ? "s" : ""}
                        </span>
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-2 transition whitespace-nowrap"
                        >
                            <RiFileExcel2Line size={16} />
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse text-sm" style={{ minWidth: 960 }}>
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-[#0F1626] text-white text-xs uppercase tracking-wider">
                                <th className="px-3 py-3 font-semibold text-center w-12 rounded-tl-xl">Sl</th>
                                <th className="px-3 py-3 font-semibold text-left w-52">Device Name</th>
                                <th className="px-3 py-3 font-semibold text-left w-44">IMEI Number</th>
                                <th className="px-3 py-3 font-semibold text-left">Issue</th>
                                <th className="px-3 py-3 font-semibold text-left">Inspection</th>
                                <th className="px-3 py-3 font-semibold text-left w-52">Final Report</th>
                                <th className="px-3 py-3 font-semibold text-left w-44">Remark</th>
                                <th className="px-3 py-3 font-semibold text-left w-36">After Tested</th>
                                <th className="px-3 py-3 w-10 rounded-tr-xl"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {devicesInspectionList.map((item, idx) => (
                                <tr
                                    key={item.srNo}
                                    className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-blue-50/40 transition-colors`}
                                >
                                    <td className="px-3 py-2 text-center w-12">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 w-52">
                                        <InspectionDeviceSearch
                                            deviceName={item.deviceName}
                                            indexNo={item.srNo}
                                            onDeviceSelect={onDeviceSelection}
                                            parentId={device.divisionId}
                                        />
                                    </td>
                                    <td className="px-3 py-2 w-44 text-xs font-mono text-gray-500">
                                        {item.imeiNumber || <span className="text-gray-300 font-sans">—</span>}
                                    </td>
                                    <td className="px-2 py-2">
                                        <textarea
                                            rows={2}
                                            value={item.issue}
                                            placeholder="Describe the issue..."
                                            className={CELL}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                                updateField(item.srNo, "issue", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <textarea
                                            rows={2}
                                            value={item.inspection}
                                            placeholder="Inspection notes..."
                                            className={CELL}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                                updateField(item.srNo, "inspection", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-2 w-52">
                                        <textarea
                                            rows={2}
                                            value={item.finalReport}
                                            placeholder="Final report..."
                                            className={CELL}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                                updateField(item.srNo, "finalReport", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-2 w-44">
                                        <textarea
                                            rows={2}
                                            value={item.remark}
                                            placeholder="Remark..."
                                            className={CELL}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                                updateField(item.srNo, "remark", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-2 w-36">
                                        <input
                                            type="text"
                                            value={item.afterTested}
                                            placeholder="After tested..."
                                            className={CELL}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                updateField(item.srNo, "afterTested", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-2 w-10">
                                        <button
                                            onClick={() => onHandleDeleteDevice(item.srNo)}
                                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                                            title="Remove device"
                                        >
                                            <BiTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {devicesInspectionList.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                                        No devices. Click "Add Device" to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <Button
                        onClick={onHandleNewDevice}
                        size="sm"
                        leftIcon={<BiPlus size={16} />}
                        className="!bg-[#2E6FF2] !text-white !rounded-lg !px-4 hover:!opacity-90"
                    >
                        Add Device
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            size="sm"
                            variant="outline"
                            className="!rounded-lg !px-6 !text-gray-600 !border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onHandleSubmit}
                            size="sm"
                            isLoading={isPending}
                            loadingText="Updating..."
                            className="!bg-amber-500 hover:!bg-amber-600 !text-white !rounded-lg !px-8 !font-semibold"
                        >
                            Update Report
                        </Button>
                    </div>
                </div>
            </div>
        </ChakraUiModal>
    );
};

export default DeviceInspectionViewEditForm;
