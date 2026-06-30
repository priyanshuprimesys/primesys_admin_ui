import { Button } from "@chakra-ui/react";
import DataTable from "../../../../global/components/DataTable/DataTable"
import { DataTableColumnInterface } from "../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import DivisionData from "./../data/division.json";
import { PiPlus } from "react-icons/pi";



// interface IDeviceInspection{
//     inspection_id: string,
//     gps_device_no: string,
//     imei_no: string,
//     issue_as_per_person: string,
//     issue_found_in_device: string,
//     working: boolean,
//     remarks: string
// }

interface IDivisionInterface{
    id:string,
    division_name:string,
    report_count:number
}




export const InspectionDataTable = () =>{



    const columns: DataTableColumnInterface<IDivisionInterface>[] =[
        {
            accessorKey:"",
            header:"Slno.",
            cell:(props)=> <>{props.row.index + 1}</>
        },
        {
            accessorKey:"division_name",
            header:"Name",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"report_count",
            header:"Report Count",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"id",
            header:'Action',
            cell:()=> <div className="px-2 text-left">
                <Button className="!bg-primaryDark !py-1 text-white !px-2"><PiPlus color="white" size={18} /></Button>
            </div>
        },
    ]
    return(
        <div>
            <DataTable
                columns={columns}
                data={DivisionData}
                headerClassName="text-left border-b-2 border-primaryDark border-r-2 font-semibold "
                bodyClassName="px-2 text-left border-b-[1px] py-2 border-r-[1px] border-primaryDark"
            />
        </div>
    )
}