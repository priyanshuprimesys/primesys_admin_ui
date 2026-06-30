import DataTable from "../../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { IApprovalBeatDivision } from "../interfaces/ApprovalBeatResponse";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";
import BeatApproveDetail from "./BeatApproveDetail";
import { useEffect, useState } from "react";
import { ApprovalBeatInitialState } from "../initialstate/ApprovalBeatResponseInitialState";
import { GetApprovalBeat } from "../hooks/GetApprovalBeat";
import { BiTrash } from "react-icons/bi";
import BeatFileDestroyModel from "./modals/BeatFileDestroyModel";


export const ApprovalBeatTable = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [beatRefFileName, setBeatRefFileName] = useState<string>("");
    const { isOpen: isDestroyOpen, onOpen: onDestroyOpen, onClose: onDestroyClose } = useDisclosure();
    const [beatList, setBeatList] = useState<IApprovalBeatDivision[]>([]);
    const [rowData, setRowData] = useState<IApprovalBeatDivision>(ApprovalBeatInitialState);
    const { data, isLoading, isSuccess } = GetApprovalBeat();

    useEffect(() => {
        if (isSuccess) {
            setBeatList(data.data.data.result);
        }
        else {
            setBeatList([]);
        }
    }, [isSuccess, data]);

    const onHandleDestroy = (file: any) => {
        setBeatRefFileName(file.refFileName);
        onDestroyOpen();
    }


    const columns: DataTableColumnInterface<IApprovalBeatDivision>[] = [
        {
            accessorKey: "refFileName",
            header: "File Name",
            cell: (props) => <span className="font-semibold">{props.getValue()}</span>
        },
        {
            accessorKey: "division_name",
            header: "Division Name",
            cell: (props) => <span className="font-semibold">{props.getValue()}</span>
        },
        {
            accessorKey: "devices",
            header: "Device Count",
            cell: (props) => (
                <p className="font-medium">{props.getValue().length}</p>
            )
        },
        {
            id: "action",
            header: "Action",
            cell: (props) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => { onOpen(); setRowData(props.row.original); }}>
                        <FaRegEye color="#0066FF" size={26} />
                    </button>
                    <button>
                        <a href={`http://64.227.176.22/beat_upload_data/${props.row.original.refFileName}`} download><PiMicrosoftExcelLogo color="green" size={26} /></a>
                    </button>
                    <button onClick={() => { onHandleDestroy(props.row.original) }}>
                        <BiTrash color="red" size={22} />
                    </button>
                </div>
            ),
            accessorKey: ""
        }
    ]



    return (
        <>
            <DataTable
                additionalHeader={true}
                isLoading={isLoading}
                tableCss="border-2 border-black"
                headerClassName="border-b-2 text-left font-bold text-sm border-black"
                bodyClassName="text-left font-light px-2 py-1 border-b-2 border-black"
                columns={columns}
                data={beatList.sort((a, b) => b.createdAt - a.createdAt)}
            />

            {
                isOpen &&
                <BeatApproveDetail beatData={rowData} isOpen={isOpen} onClose={onClose} />
            }

            {
                isDestroyOpen &&
                <BeatFileDestroyModel refFileName={beatRefFileName} isOpen={isDestroyOpen} onClose={onDestroyClose} />
            }
        </>
    )
}