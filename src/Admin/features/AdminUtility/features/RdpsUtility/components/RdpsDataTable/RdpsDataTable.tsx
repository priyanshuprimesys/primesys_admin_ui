import { Button, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { RdpsEditModal } from "../RdpsEditModule/RdpsEditModal";
import { useGetDivisionRdpsQuery } from "../../../../../../../api/queries/app/hooks/division_rdps_get_api_hooks";
import { useDeleteDivisionRdps } from "../../../../../../../api/queries/app/hooks/division_rdps_delete_api_hooks";
import { DivisionRdpsContext } from "../../../../../../../contexts/AppLayout/Admin/DivisionRdpsContext/DivisionRdpsContext";
import { IDivisionRdpsResponseInterface } from "../../../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";
import { DataTableColumnInterface } from "../../../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import DataTable from "../../../../../../../global/components/DataTable/DataTable";
import { IconsStore } from "../../../../../../../global/Icons/IconsStore";
import RdpsExcel from "../RdpsExcel/RdpsExcel";
import { DataTableContext } from "../../../../../../../contexts/AppLayout/DataTableContext/DataTableContext";

interface RdpsTableInterface {
    divisionId: string;
}


const RdpsDataTable: React.FC<RdpsTableInterface> = ({ divisionId }) => {


    const { data, isFetching, isSuccess } = useGetDivisionRdpsQuery(divisionId);
    const { mutate } = useDeleteDivisionRdps();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { setDivisionRdpsData } = useContext(DivisionRdpsContext);
    const [editID, setEditID] = useState<string>("");
    const { tableInstance } = useContext(DataTableContext);


    useEffect(() => {
        if (isSuccess) {
            setDivisionRdpsData(data.data);
        }
    }, [isSuccess, data]);


    const handleClick = (id: string) => {
        if (!id) {
            alert("Id is Empty")
        }
        else {
            mutate(id);
        }

    }

    const handleEditID = (edit: string) => {
        setEditID(edit);
        onOpen();
    }




    const columns: DataTableColumnInterface<IDivisionRdpsResponseInterface>[] = [
        {
            accessorKey: "",
            header: "SlNo",
            cell: (props) => <>{props.row.index + 1}</>
        },
        {
            accessorKey: "kilometer",
            header: "Km",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "distance",
            header: "Distance",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "latitude",
            header: "Latitude",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "longitude",
            header: "Longitude",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "section",
            header: "Section",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "feature_detail",
            header: "Feature Detail",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "feature_code",
            header: "Feature Code",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "feature_image",
            header: "Feature Image",
            cell: (props) => <div className="flex justify-center h-8 w-8 rounded"> <img src={"https://primesystrack.in" + props.getValue().replace("~/Images", "/")} /> { }</div>
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: (props) => <div className="flex gap-2">
                <Button className="border-2 !border-yellow-500 !bg-white" onClick={() => handleEditID(props.getValue())}>{IconsStore.editIcon}</Button>
                <Button className="border-2 !border-red-500 !bg-white" onClick={() => handleClick(props.getValue())}>{IconsStore.deleteIcon}</Button>
            </div>
        },
    ]

    const featureCode = "KM Start 39"

    console.log(
        data?.data.data.result.filter((rdps) => rdps.feature_detail.trim().toLowerCase().includes(featureCode.trim().toLowerCase()))
    );



    return (
        <>
            <DataTable
                additionalHeader={true}
                additionHeaderComponent={[<RdpsExcel deviceRdpsDetail={data?.data ? tableInstance : []} />]}
                isLoading={isFetching}
                data={data?.data.data.result}
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
