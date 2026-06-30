import { useEffect, useState } from "react";
import DataTable from "../../../../global/components/DataTable/DataTable";
import { useGetAllDeviceInspectionReport } from "../data/queryOptions";
import { IDeviceInspectionReport } from "../data/schema";
import { DataTableColumnInterface } from "../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { BsEye } from "react-icons/bs";
import { Button, useDisclosure } from "@chakra-ui/react";
import DeviceInspectionAddForm from "../components/DeviceInspectionAddForm";
import { getCutomTimeStampTODate } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import DeviceInspectionViewEditForm from "../components/DeviceInspectionViewEditForm";



const DeviceInspectionDefault:IDeviceInspectionReport = {
    divisionId: "",
    divisionName: "",
    reportDate: 0,
    devices: []
}



function DeviceInspectionIndex(){

    const [deviceInspectionData,setDeviceInspectionData] = useState<IDeviceInspectionReport[]>([]);

    const {data,isLoading,isSuccess} = useGetAllDeviceInspectionReport();
    const [deviceInspectionReport,setDeviceInspectionReport] = useState<IDeviceInspectionReport>(DeviceInspectionDefault);
    const {onClose,onOpen,isOpen} = useDisclosure();
    const {onClose:onCloseEdit,onOpen:onOpenEdit,isOpen:isOpenEdit} = useDisclosure();

    useEffect(()=>{
        if(isSuccess && data.data.success){
            setDeviceInspectionData(data.data.data.result);
        }
    },[isSuccess,data]);

    const handleView = (device:IDeviceInspectionReport) =>{
        setDeviceInspectionReport(device);
        onOpenEdit();
    }


    const columns: DataTableColumnInterface<IDeviceInspectionReport>[] = [
        {
            accessorKey:"divisionName",
            header:"Division Name",
            cell:(props)=> <span className="px-2">{props.getValue()}</span>
        },
        {
            accessorKey:"reportDate",
            header:"Report Date",
            cell:(props)=> <span className="px-2">{getCutomTimeStampTODate(props.getValue())}</span>
        },
        {
            accessorKey:"",
            header:"Device Count",
            cell:(row) => <span className="px-6">{row.row.original.devices.length}</span>
        },
        {
            accessorKey:"divisionId",
            header:"Action",
            cell:(props)=> <div onClick={()=> handleView(props.row.original)} className="px-6 cursor-pointer">{<BsEye size={20}/>}</div>
        }
    ]; 


    return(
        <div>
            <DataTable
                data={deviceInspectionData}
                isLoading={isLoading}
                columns={columns}
                tableHeadCss="text-left border-b-2 border-black"
                headerClassName="font-bold"
                bodyClassName="text-left py-2 border-b-2 border-dark"
                additionalHeader={true}
                additionHeaderComponent={[<Button onClick={()=> onOpen()} className="!bg-primaryDark !text-white">Add Report</Button>]}
            />

            {
                isOpen && 
                <DeviceInspectionAddForm isOpen={isOpen} onClose={onClose} />
            }

            {
                isOpenEdit &&
                <DeviceInspectionViewEditForm isOpen={isOpenEdit} onClose={onCloseEdit} device={deviceInspectionReport} />
            }
        </div>
    )
}


export default DeviceInspectionIndex;