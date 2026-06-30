import { RiFileExcel2Line } from "react-icons/ri";
import Exceljs from "exceljs";
import { DivisionSingleResponse } from "../../../../../../../interfaces/AppInterfaces/AllDivisionDevices/DivisionSingleDeviceResponseInterface";
import { useSuccessNotification } from "../../../../../../../utils/hooks/notification/useSuccessNotification";
import { FiledArrayInterface } from "../DeviceDataExcelUpload";


interface ExcelExportInterface {
    data: DivisionSingleResponse[];
    lockedData: FiledArrayInterface[];
    deviceType: string,
    devices: string
}



export const ExcelExport: React.FC<ExcelExportInterface> = ({ data, lockedData, deviceType, devices }) => {




    const exportExcel = () => {
        // if (data.length < 1) {
        //     useErrorNotification("No data available");
        //     return;
        // }

        const workBook = new Exceljs.Workbook();
        const sheet = workBook.addWorksheet("Division Sheet");

        sheet.getRow(1).font = {
            name: "Arial Black",
            color: { argb: "1,0,0,0" },
            size: 10,
            bold: true
        }

        sheet.columns = [
            {
                header: "device_imei",
                key: "device_imei",
                width: 25,
                style: {
                    alignment: {
                        wrapText: true
                    },
                    numFmt: '@'
                },
            },
            {
                header: "device_name",
                key: "device_name",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "device_no",
                key: "device_no",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "report_time_margin",
                key: "report_time_margin",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "report_dist_margin",
                key: "report_dist_margin",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "on_track_margin",
                key: "on_track_margin",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "device_sim_no",
                key: "device_sim_no",
                style: {
                    alignment: {
                        wrapText: true
                    },
                },
                width: 25,
            },
            {
                header: "device_sim_imei_no",
                key: "device_sim_imei_no",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "trip_wise_report",
                key: "trip_wise_report",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "active_status",
                key: "active_status",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "report_enable",
                key: "report_enable",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 25,
            },
            {
                header: "deviceTypeId",
                key: "deviceTypeId",
                style: {
                    alignment: {
                        wrapText: true
                    }
                },
                width: 20,
            }
        ];

        sheet.columns.forEach((col) => {
            col.style = {
                numFmt: '@',
                alignment: {
                    wrapText: true
                }
            }
        });

        const deviceArr = devices.split(",").map((item) => Number(item)).filter((item) => !Number.isNaN(item) && item != 0);
        const exportData = deviceArr.length > 0 ? data.filter(obj => deviceArr.some(obj2 => obj2 == obj.deviceNo)) : data;



        if (Number(deviceType) != 0) {
            exportData.filter((item) => item.deviceTypeId == Number(deviceType)).map(item => {
                const row = sheet.addRow({
                    device_imei: String(item.deviceImei),
                    device_name: String(item.deviceName),
                    report_time_margin: String(item.reportTimeMargin),
                    report_dist_margin: String(item.reportDistMargin),
                    on_track_margin: String(item.onTrackMargin),
                    device_sim_no: String(item.deviceSimNo),
                    device_sim_imei_no: String(item.deviceSimImeiNo),
                    device_no: String(item.deviceNo),
                    trip_wise_report: String(item.tripWiseReport),
                    active_status: String(item.active_status),
                    report_enable: String(item.reportEnable),
                    deviceTypeId: String(item.deviceTypeId)
                });
                row.getCell('device_imei').protection = { locked: true };
                row.getCell('device_name').protection = { locked: lockedData[4].isChecked };
                row.getCell('device_no').protection = { locked: lockedData[7].isChecked };
                row.getCell('report_time_margin').protection = { locked: lockedData[1].isChecked };
                row.getCell('report_dist_margin').protection = { locked: lockedData[2].isChecked };
                row.getCell('on_track_margin').protection = { locked: lockedData[3].isChecked };
                row.getCell('device_sim_no').protection = { locked: lockedData[5].isChecked };
                row.getCell('device_sim_imei_no').protection = { locked: lockedData[6].isChecked };
                row.getCell('trip_wise_report').protection = { locked: lockedData[8].isChecked };
                row.getCell('active_status').protection = { locked: lockedData[9].isChecked };
                row.getCell('report_enable').protection = { locked: lockedData[10].isChecked };
                row.getCell('deviceTypeId').protection = { locked: lockedData[11].isChecked };
            });
        }
        else {
            exportData.map(item => {
                const row = sheet.addRow({
                    device_imei: String(item.deviceImei),
                    device_name: String(item.deviceName),
                    report_time_margin: String(item.reportTimeMargin),
                    report_dist_margin: String(item.reportDistMargin),
                    on_track_margin: String(item.onTrackMargin),
                    device_sim_no: String(item.deviceSimNo),
                    device_sim_imei_no: String(item.deviceSimImeiNo),
                    device_no: String(item.deviceNo),
                    trip_wise_report: String(item.tripWiseReport),
                    active_status: String(item.active_status),
                    report_enable: String(item.reportEnable),
                    deviceTypeId: String(item.deviceTypeId)
                });
                row.getCell('device_imei').protection = { locked: true };
                row.getCell('device_name').protection = { locked: lockedData[4].isChecked };
                row.getCell('device_no').protection = { locked: lockedData[7].isChecked };
                row.getCell('report_time_margin').protection = { locked: lockedData[1].isChecked };
                row.getCell('report_dist_margin').protection = { locked: lockedData[2].isChecked };
                row.getCell('on_track_margin').protection = { locked: lockedData[3].isChecked };
                row.getCell('device_sim_no').protection = { locked: lockedData[5].isChecked };
                row.getCell('device_sim_imei_no').protection = { locked: lockedData[6].isChecked };
                row.getCell('trip_wise_report').protection = { locked: lockedData[8].isChecked };
                row.getCell('active_status').protection = { locked: lockedData[9].isChecked };
                row.getCell('report_enable').protection = { locked: lockedData[10].isChecked };
                row.getCell('deviceTypeId').protection = { locked: lockedData[11].isChecked };
            });
        }



        sheet.protect('primesys', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        workBook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            });

            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `DivisionDevices${new Date().toLocaleDateString([], { day: '2-digit', month: "2-digit", year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.xlsx`;
            anchor.click();
            useSuccessNotification("Division Devices Exported");
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        })

    }





    return (
        <button onClick={() => exportExcel()} className="flex items-center gap-3 px-4 py-2 text-white border-2 rounded-md bg-primaryDark border-primaryDark">
            <RiFileExcel2Line />
            <span>Export</span>
        </button>
    )
}