import { Button, useDisclosure } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useDeleteDivisionRdps } from "../../../../api/queries/app/hooks/division_rdps_delete_api_hooks";
import { DataTableContext } from "../../../../contexts/AppLayout/DataTableContext/DataTableContext";
import { DataTableColumnInterface } from "../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";
import DataTable from "../../../../global/components/DataTable/DataTable";
import RdpsExcel from "../../AdminUtility/features/RdpsUtility/components/RdpsExcel/RdpsExcel";
import { RdpsContext } from "../contexts/RdpsContext";
import { RdpsEditModal } from "../../AdminUtility/features/RdpsUtility/components/RdpsEditModule/RdpsEditModal";
import { IconsStore } from "../../../../global/Icons/IconsStore";



const RdpsDataTable = () => {


    const {mutate} = useDeleteDivisionRdps();
    const {isOpen,onClose,onOpen} = useDisclosure();
    const [editID,setEditID] = useState<string>("");
    const {tableInstance} = useContext(DataTableContext);
    const {rdpsData,rdpsApiLoading} = useContext(RdpsContext);



    const handleClick = (id:string) => {
        if(!id)
        {
            alert("Id is Empty")
        }
        else{
            mutate(id);
        }
        
    }

    const handleEditID = (edit:string)=>{
        setEditID(edit);
        onOpen();
    }




    const columns: DataTableColumnInterface<IDivisionRdpsResponseInterface>[] =[
        {
            accessorKey:"",
            header:"SlNo",
            cell:(props)=> <>{props.row.index + 1}</>
        },
        {
            accessorKey:"kilometer",
            header:"Km",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"distance",
            header:"Distance",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"latitude",
            header:"Latitude",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"longitude",
            header:"Longitude",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"section",
            header:"Section",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"feature_detail",
            header:"Feature Detail",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"feature_code",
            header:"Feature Code",
            cell:(props)=> <>{props.getValue()}</>
        },
        {
            accessorKey:"feature_image",
            header:"Feature Image",
            cell:(props)=> <div className="flex justify-center h-8 w-8 rounded"> <img src={"https://primesystrack.in" + props.getValue().replace("~/Images", "/")} /> {}</div>
        },
        {
            accessorKey:"id",
            header:"Action",
            cell:(props)=> <div className="flex gap-2">
                <Button className="border-2 !border-yellow-500 !bg-white" onClick={()=> handleEditID(props.getValue())}>{IconsStore.editIcon}</Button>
                <Button className="border-2 !border-red-500 !bg-white" onClick={()=> handleClick(props.getValue())}>{IconsStore.deleteIcon}</Button>
                </div>
        },
    ]



  return (
    <>
    <DataTable
        additionalHeader={true}
        additionHeaderComponent={[<RdpsExcel deviceRdpsDetail={rdpsData?.data ? tableInstance : []} />]}
        isLoading={rdpsApiLoading}
        data={rdpsData?.data.result}
        columns={columns}
        tableCss="border-2 border-dark"
        tableHeadCss="bg-dark py-2"
        tableBodyCss="text-center  py-2"
        bodyClassName="py-2 text-center flex justify-center border-black border-b-2"
        headerClassName="font-semibold text-sm py-2 text-white"
    />
    {
        isOpen && <RdpsEditModal
        isOpen={isOpen}
        onClose={onClose}
        editId={editID}
        />
    }
    </>
  )
}

export default RdpsDataTable;
