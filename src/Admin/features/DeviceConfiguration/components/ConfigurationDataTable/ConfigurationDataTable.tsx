import { useContext,useEffect,useState } from "react";
import { useGetDeviceCommandHistory } from "../../../../../api/queries/app/hooks/device-command-history-api-hooks";
import DataTable from "../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { IDeviceCommandHistoryResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceCommandHistoryResponse/DeviceCommandHistoryResponse/DeviceCommandHistoryResponseInterface";
import { DeviceCommandHistoryContext } from "../../../../../contexts/AppLayout/Admin/DeviceCommand/DeviceCommandHistory/DeviceCommandHistoryContext";
import { getTimeStampToDate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import LoginName from "../../hooks/LoginName";
import RefreshButton from "../Button/RefreshButton/RefreshButton";
import CommandInfo from "../CommandInfo/CommandInfo";
import StatusInfo from "../Status/StatusInfo";
import CommandStatusInfo from "../Status/CommandStatusInfo";
import ModalButton from "../Button/ModalButton/ModalButton";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import DeviceResponse from "../DeviceResponse.tsx/DeviceResponse";
import CommandHistoryButton from "../Button/CommandHistoryButton/CommandHistoryButton";
import CommandHistoryModal from "../Modal/CommandHistoryModal/CommandHistoryModal";
import { useDisclosure } from "@chakra-ui/react";
import ExcelExport from "../DataExport/ExcelExport";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";
// import { IconComponents } from "../../../../../global/Icons/IconsStore";
// import CommandInfo from "../CommandInfo/CommandInfo";







const ConfigurationDataTable = () => {

  const { commandStartTime, commandEndTime,isDataFetching,setIsDataFetching } = useContext(DeviceCommandHistoryContext);


  const { data,isLoading,isSuccess} = useGetDeviceCommandHistory({ startTime: commandStartTime, endTime: commandEndTime });
  const {tableInstance} = useContext(DataTableContext);

  const [CommandResponse,setCommandResponse] = useState<string>('');
  const {onClose,isOpen,onOpen} = useDisclosure();
  const {onClose:onResponseClose,onOpen:onResponseOpen,isOpen:isResponseOpen} = useDisclosure();


  useEffect(()=>{
    if(isSuccess)
    {
      setIsDataFetching(false);
    }
  },[isSuccess,data]);



  const onHandleResponse = (command:string) =>{
    setCommandResponse(command);
    onResponseOpen();
  }





  const columns: DataTableColumnInterface<IDeviceCommandHistoryResponseInterface>[] = [
    {
      accessorKey: "deviceName",
      header: "Device Name",
      size: 1,
      cell: (props) => <>{props.getValue()}</>
    },
    {
      accessorKey: "deviceImei",
      header: "DeviceImei",
      size: 1,
      cell: (props) => <>{props.getValue()}</>
    },
    {
      accessorKey: "command",
      header: "Command",
      size: 1,
      cell: (props) => <>{<CommandInfo command={props.getValue()} />}</>
    },
    {
      accessorKey: "commandDeliveredMsg",
      header: "Command Response",
      size: 0.5,
      cell: (props) => <>{<CommandStatusInfo commandResponse={props.getValue()} />}</>
    },
    {
      accessorKey: "deviceCommandResponse",
      header: "Device Response",
      size: 3,
      cell: (props) => <div className="text-left"><ModalButton response={props.getValue()} icon={IconComponents.moreInfoIcon} onHandleClick={() => onHandleResponse(props.getValue())} /></div>
    },
    {
      accessorKey: 'timestamp',
      header: "Command Sent At",
      size: 1,
      cell: (props) => <>{getTimeStampToDate(props.getValue())}</>
    },
    {
      accessorKey: "loginName",
      header: "Command sent by",
      size: 1,
      cell: (props) => <><LoginName props={props.getValue()} resend={props.row.original.resend} /></>
    }
  ]


  return (
    <>
      <div>
        <DataTable
        isLoading={isDataFetching || isLoading}
          columns={columns}
          additionalHeader={true}
          additionHeaderComponent={[<StatusInfo/>,<RefreshButton />,<CommandHistoryButton onHandleCommandHistory={onOpen} disabled={isDataFetching && isLoading} />,<ExcelExport commandHistoryData={tableInstance}/>]}
          data={ data?.data ? data?.data?.data?.result : []}
          bodyClassName="text-center font-normal border-b border-gray-600 py-2 text-xs px-2"
          headerClassName="text-xs font-bold py-4 text-gray-200"
          tableHeadCss="border-2 border-gray-600 bg-dark"
          tableCss="border-2 border-gray-700"
        />
      </div>
      {isResponseOpen && <DeviceResponse commandResponse={CommandResponse} isOpen={isResponseOpen} onClose={onResponseClose} />}
      {isOpen && <CommandHistoryModal isOpen={isOpen} onClose={onClose}   />}
    </>

  )
}

export default ConfigurationDataTable
