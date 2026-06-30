import { Button } from "@chakra-ui/react"
import { IconComponents } from "../../../../../global/Icons/IconsStore"
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import Exceljs  from 'exceljs';
import { getTimeStampToDate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { nameShortner } from "../../hooks/nameshortner";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { IDeviceCommandHistoryResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryResponseInterface";



interface ExcelDataProps{
    commandHistoryData: IDeviceCommandHistoryResponseInterface[] | undefined | any[] | null;
}



const ExcelExport: React.FC<ExcelDataProps> = ({commandHistoryData}) => {

    const exportExcelFile = () =>{
        if(commandHistoryData)
        {
                if(commandHistoryData.length < 1)
                {
                    useErrorNotification("No Data Available");
                    return;
                }
                const workBook = new Exceljs.Workbook();
                const sheet = workBook.addWorksheet("Command History Sheet");
        
                sheet.getRow(1).font={
                    name:"Arial Black",
                    color:{argb:"1,0,0,0"},
                    size:10,
                    bold:true
                }
        
                sheet.columns=[
                    {
                        header:"Device Name",
                        key:"deviceName",
                        width:30
                    },
                    {
                        header:"Device Imei",
                        key:"deviceImei",
                        width:30
                    },
                    {
                        header:"Command",
                        key:"command",
                        width:30
                    },
                    {
                        header:"Command Response",
                        key:"commandDeliveredMsg",
                        width:40
                    },
                    {
                        header:"Device Response",
                        key:"deviceCommandResponse",
                        width:40
                    },
                    {
                        header:"Command Sent At",
                        key:"timestamp",
                        width:30
                    },
                    {
                        header:"Command Sent By",
                        key:"loginName",
                        width:30
                    }
                ];

                commandHistoryData.map(item=>{
                    sheet.addRow({
                        deviceName:item.deviceName,
                        deviceImei:item.deviceImei,
                        command:item.command,
                        commandDeliveredMsg: item.commandDeliveredMsg,
                        deviceCommandResponse: item.deviceCommandResponse,
                        timestamp: getTimeStampToDate(item.timestamp),
                        loginName:nameShortner(item.loginName)

                    })
                });

                workBook.xlsx.writeBuffer().then(data=>{
                    const blob = new Blob([data],{
                        type:"application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
                    });
                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = `CommandHistory${new Date().toLocaleDateString([],{day:'2-digit',month:"short",year:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}.xlsx`;
                    anchor.click();
                    useSuccessNotification("History Downloaded");
                    window.URL.revokeObjectURL(url);
                })
        }
     
    }



  return (
    <Button onClick={exportExcelFile} className="!bg-white border-2 border-dark">
        {IconComponents.excelIcon}
    </Button>
  )
}

export default ExcelExport
