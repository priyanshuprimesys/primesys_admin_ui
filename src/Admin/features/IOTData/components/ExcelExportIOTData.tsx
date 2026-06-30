import { Button } from "@chakra-ui/react";
import { useErrorNotification } from "../../../../utils/hooks/notification/useErrorNotification"
import { IDataPacketInterface } from "../interface/IOTDataInterface"
import Exceljs from "exceljs";
import { IconComponents } from "../../../../global/Icons/IconsStore";
import { useSuccessNotification } from "../../../../utils/hooks/notification/useSuccessNotification";
import { getTimeStampToDate } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";



interface ExcelExportDataInterface{
    data: IDataPacketInterface[]
}



const ExcelExportIOTData: React.FC<ExcelExportDataInterface> = ({data}) =>{


    const beatExcelExport = () =>{
        if(data){
            if(data.length < 1)
            {
                useErrorNotification("No Data Available");
                return;
            }
    
                const workBook = new Exceljs.Workbook();
                  const sheet = workBook.addWorksheet("IOT Data Packet");
            
                  sheet.getRow(1).font = {
                    name: "Arial Black",
                    color: { argb: "1,0,0,0" },
                    size: 10,
                    bold: true,
                };

                sheet.columns = [
                    {
                      header: "Device Imei",
                      key: "deviceImei",
                      width: 30,
                      alignment: {
                        wrapText: true,
                        horizontal: "left",
                      },
                    },
                    {
                      header: "Device Packet",
                      key: "packet",
                      width: 30,
                      alignment: {
                        wrapText: true,
                        horizontal: "left",
                      },
                    },
                    {
                      header: "Date&Time",
                      key: "timestamp",
                      width: 30,
                      alignment: {
                        wrapText: true,
                        horizontal: "left",
                      },
                    },
                    {
                      header: "Packet From",
                      key: "packetFrom",
                      width: 30,
                      alignment: {
                        wrapText: true,
                        horizontal: "left",
                      },
                    },
                    {
                      header: "Packet Type",
                      key: "packetType",
                      width: 30,
                      alignment: {
                        wrapText: true,
                        horizontal: "left",
                      },
                    },
                  ];
                  data.map((item)=>{
                    const row = sheet.addRow({
                        deviceImei: item.deviceImei,
                        packet: item.packet,
                        timestamp: getTimeStampToDate(item.timestamp),
                        packetFrom: item.packetFrom,
                        packetType: item.packetType
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
    }



    return(
            <Button
              onClick={beatExcelExport}
              className="!bg-white !border-2 !border-dark"
            >
              {IconComponents.excelIcon}
            </Button>
    )
}


export default ExcelExportIOTData;