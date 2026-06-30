import { useState } from "react";
import DataTable from "../../../../global/components/DataTable/DataTable";
import { IconComponents } from "../../../../global/Icons/IconsStore";
import { DataTableColumnInterface } from "../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { getTimeStampToDate } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { IDataPacketInterface } from "../interface/IOTDataInterface";
import ExcelExportIOTData from "./ExcelExportIOTData";
import MoreInfoButton from "./MoreInfoButton";
import { useDisclosure } from "@chakra-ui/react";
import DevicePacketResponse from "./DataPacketResponse";
import DevicePacketFromInfo from "./DevicePacketFromInfo";


interface IOTDataTableInterface {
    data: IDataPacketInterface[],
    isFetching: boolean,
}



const IOTDataTable: React.FC<IOTDataTableInterface> = ({ data, isFetching }) => {

    const [dataPacketResponse, setDataPacketResponse] = useState<string>("");
    const { onClose, onOpen, isOpen } = useDisclosure();

    const onHandleResponse = (dataPacket: string) => {
        setDataPacketResponse(dataPacket);
        onOpen();
    }



    const columns: DataTableColumnInterface<IDataPacketInterface>[] = [
        {
            accessorKey: "packet",
            header: "Data Packet",
            cell: (props) => <>{<MoreInfoButton dataPacket={props.getValue()} icon={IconComponents.moreInfoIcon} onHandleClick={() => onHandleResponse(props.getValue())} />}</>
        },
        {
            accessorKey: "timestamp",
            header: "Date&Time",
            cell: (props) => <span>{getTimeStampToDate(props.getValue())}</span>
        },
        {
            accessorKey: "packetType",
            header: "Packet Type",
            cell: (props) => <span>{props.getValue()}</span>
        }
    ]



    return (
        <>
            <DataTable
                columns={columns}
                isLoading={isFetching}
                data={data ? data : []}
                additionalHeader={true}
                additionHeaderComponent={[<DevicePacketFromInfo />, <ExcelExportIOTData data={data} />]}
                bodyClassName={`text-center font-normal border-b border-gray-600 py-2 text-xs px-2`}
                tdRowColor="server"
                headerClassName="text-xs font-bold py-4 text-gray-200"
                tableHeadCss="border-2 border-gray-600 bg-dark"
                tableCss="border-2 border-gray-700"
            />

            {
                isOpen &&
                <DevicePacketResponse isOpen={isOpen} onClose={onClose} dataPacket={dataPacketResponse} />
            }
        </>
    )
}


export default IOTDataTable;