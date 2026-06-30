import { Button } from "@chakra-ui/react";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import { IKeymanBeatDataTableInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatDataTableInterface";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import Exceljs from "exceljs";
import { convertSecondsToTime } from "../../services/convertSecondsToTime";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";

interface BeatMoudleExcelExportProps {
  data: IKeymanBeatDataTableInterface[];
}

const BeatModuleExcelExport: React.FC<BeatMoudleExcelExportProps> = ({
  data,
}) => {
  const beatExcelExport = () => {
    if (data) {
      if (data.length < 1) {
        useErrorNotification("No Data Available to export");
        return;
      }
      const workBook = new Exceljs.Workbook();
      const sheet = workBook.addWorksheet("Beat Module Sheet");

      sheet.getRow(1).font = {
        name: "Arial Black",
        color: { argb: "1,0,0,0" },
        size: 10,
        bold: true,
      };

      sheet.columns = [
        {
          header: "Device Name",
          key: "deviceName",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Device No",
          key: "deviceNo",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Section Name",
          key: "sectionName",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Trip Start Km",
          key: "tstartKm",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Trip End Km",
          key: "tendKm",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Start Time",
          key: "startTime",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "End Time",
          key: "endTime",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Break Start Time",
          key: "bstartTime",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
        {
          header: "Break End Time",
          key: "bendTime",
          width: 30,
          alignment: {
            wrapText: true,
            horizontal: "left",
          },
        },
      ];

      data.map((item) => {
        const row = sheet.addRow({
          deviceName: item.deviceName,
          deviceNo: item.deviceNo,
          sectionName: item.sectionName,
          tstartKm: item.tstartKm,
          tendKm: item.tendKm,
          startTime: convertSecondsToTime(item.startTime),
          endTime: convertSecondsToTime(item.endTime),
          bstartTime: convertSecondsToTime(item.bstartTime),
          bendTime: convertSecondsToTime(item.bendTime),
        });

        row.eachCell((cell) => {
          cell.alignment = {
            wrapText: true,
            horizontal: "left",
          };
        });
      });

      workBook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `Beat${new Date().toLocaleDateString([], {
          day: "2-digit",
          month: "short",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}.xlsx`;
        anchor.click();
        useSuccessNotification("Beat Downloaded");
        window.URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <Button
      onClick={beatExcelExport}
      className="!bg-white !border-2 !border-dark"
    >
      {IconComponents.excelIcon}
    </Button>
  );
};

export default BeatModuleExcelExport;
