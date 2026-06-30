import { useDisclosure } from "@chakra-ui/react"
import DataTable from "../../../../../global/components/DataTable/DataTable"
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface"
import { IKeymanBeatDataTableInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatDataTableInterface"
import { convertSecondsToTime } from "../../services/convertSecondsToTime"
import EditButton from "../Button/EditButton"
import EditSingleBeatModal from "../EditSingleBeatUpload/EditSingleBeatModal"
import { useMemo, useState } from "react"
import DeleteButton from "../Button/DeleteButton"
import DeleteBeatModal from "../DeleteBeatModal/DeleteBeatModal"
import BeatModuleExcelExport from "../BeatModuleExcelExport/BeatModuleExcelExport"




interface KeymanBeatTableProps{
    data:any[]
    isLoading:boolean
}



const KeymanBeatDataTable: React.FC<KeymanBeatTableProps> = ({data,isLoading}) => {


    const [studentDeviceBeatId,setStudentDeviceBeatId] = useState<string>('');
    const [delBeatId,setDelBeatId] = useState<string>("");


    const {isOpen,onOpen,onClose} = useDisclosure();
    const {isOpen:delOpen,onOpen:delOnOpen,onClose:delOnClose} = useDisclosure();



    const handleEditClick = (editId:string) =>{
        setStudentDeviceBeatId(editId);
        onOpen();
    }

    const onHandleDelete = (beatId:string) =>{
        setDelBeatId(beatId);
        delOnOpen();
    }

    /* derive a per-device trip number ordered by start time */
    const tripNoMap = useMemo(() => {
        const byDevice: Record<string, IKeymanBeatDataTableInterface[]> = {};
        (data ?? []).forEach(d => {
            const key = String(d.deviceNo ?? d.deviceName ?? "");
            (byDevice[key] ??= []).push(d);
        });
        const map: Record<string, number> = {};
        Object.values(byDevice).forEach(group => {
            [...group]
                .sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))
                .forEach((d, i) => { map[d.beatId] = i + 1; });
        });
        return map;
    }, [data]);




    const columns:DataTableColumnInterface<IKeymanBeatDataTableInterface>[] =[
        {
            accessorKey:"deviceName",
            header:"Device Name",
            cell:(props) => <span className="font-semibold">{props.getValue()}</span>
        },
        {
            id:"tripNo",
            accessorKey:"tripNo",
            header:"Trip No",
            cell:(props)=> (
                <span className="inline-flex items-center justify-center min-w-[26px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {tripNoMap[props.row.original.beatId] ?? "—"}
                </span>
            )
        },
        {
            accessorKey:"tstartKm",
            header:"Start - End Km",
            cell:(props)=>(
                <>
                {props.row.original ? `${props.row.original.tstartKm} - ${props.row.original.tendKm}` : props.row.groupByVal}
                </>
            )
        },
        {
            accessorKey:"startTime",    
            header:"Start Time - End Time",
            cell:(props)=>(
                <>
                {props.row.original ? `${convertSecondsToTime(props.row.original.startTime)} - ${convertSecondsToTime(props.row.original.endTime)}` : props.row.groupByVal}
                </>
            )
        },
        {
            accessorKey:"bstartTime",
            header:"B start - B end",
            cell:(props)=>(
                <>
                {props.row.original ? `${convertSecondsToTime(props.row.original.bstartTime)} - ${convertSecondsToTime(props.row.original.bendTime)}` : props.row.groupByVal}
                </>
            )
        },
        {
            accessorKey:"beatId",
            header:"Action",
            cell:(props) => <div className="flex gap-2">{<EditButton onHandleClick={() => handleEditClick(props.getValue())} />}{<DeleteButton onHandleClick={()=>onHandleDelete(props.getValue())}/>}</div>
        },

    ]





  return (
    <>
        <DataTable
        additionalHeader={true}
        additionHeaderComponent={[
            <a download className="flex justify-end text-blue-700 underline underline-offset-1" href={"http://primesystrack.co.in/templates/beats_upload_template.xlsx"}>Download Beat upload Template</a>
        ,<BeatModuleExcelExport data={data}/>]}
        isLoading={isLoading}
        tableCss="border-2 border-black"
        headerClassName="border-b-2 text-left font-bold text-sm border-black"
        bodyClassName="text-left px-2 py-1 border-b-2 border-black"
        columns={columns}
        data={data}
        /> 

        {isOpen && <EditSingleBeatModal beatId={studentDeviceBeatId} isOpen={isOpen} onClose={onClose} />}
        {delOpen && <DeleteBeatModal beatId={delBeatId} isOpen={delOpen} onClose={delOnClose} />}
    </>
  )
}

export default KeymanBeatDataTable
