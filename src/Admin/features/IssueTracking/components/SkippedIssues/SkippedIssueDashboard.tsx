import DataTable from "../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { getCutomTimeStampTODate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { GetAllSkipIssuesHook } from "../../hooks/GetAllSkipIssuesHook";
import { ISkippedIssueInterface } from "../../interfaces/SkippedIssueInterface";
import { IIssueEditResponse } from "../IssueDashboard/Components/IssueEditModule/Interface/IssueCommentInterface";
import { useContext } from "react";
import { PostRestoreAsIssue } from "../../hooks/PostRestoreAsIssue";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";




export const SkippedIssueDashboard = () => {
    const {userDetail} = useContext(UserDetailContext);
    const {data} = GetAllSkipIssuesHook();
    const {mutate}  = PostRestoreAsIssue();

    const handleRestore = (response:IIssueEditResponse)=>{
        setTimeout(() => {
            mutate({
                userId: userDetail.data.result.divisionId,
                issueId: response.id
            });
        }, 600);
    }
   

    const columns:DataTableColumnInterface<ISkippedIssueInterface>[] = [
        {
            accessorKey: "groupName",
            header: "Group Name",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "senderName",
            header: "Sender Name",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "message",
            header: "Message",
            cell: (props) => <>{props.getValue()}</>
        },
        {
            accessorKey: "postTime",
            header: "Sent Time",
            cell: (props) => <>{getCutomTimeStampTODate(props.getValue())}</> 
        },
        {
            accessorKey: "isIssue",
            header: "Is Issue",
            cell: (props) => <>{props.getValue() ? "True" : "False"}</> 
        },
        {
            accessorKey: "activeStatus",
            header: "Active",
            cell: (props) => <>{props.getValue() ? "True" : "False"}</> 
        },
        {
            accessorKey:"id",
            header:"Action",
            cell: (props)=> <>{<button onClick={()=> handleRestore(props.row.original)} className="flex items-center justify-center px-3 py-3 text-white bg-yellow-600 rounded-md">Restore</button>}</>
        }
    ];



    return(
        <>
            <DataTable
                columns={columns}
                data={data?.data ? data.data.data.flat().sort((a,b)=> b.postTime - a.postTime) : []}
                tableHeadCss="bg-dark"
                tableCss="border border-zinc-400 rounded-xl"
                headerClassName="text-gray-300 font-bold py-2  text-left"
                bodyClassName="border-b border-gray-300 py-2 text-left px-2"
            />
        </>
    )
}