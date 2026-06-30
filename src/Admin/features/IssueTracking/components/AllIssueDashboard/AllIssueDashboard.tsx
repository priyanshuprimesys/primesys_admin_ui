import { Input, Select, useDisclosure } from "@chakra-ui/react";
import DataTable from "../../../../../global/components/DataTable/DataTable";
import { DataTableColumnInterface } from "../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { getCutomTimeStampTODate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { GetAllIssues } from "../../hooks/GetAllIssuesHook"
import { IDeviceIssueResponseInterface } from "../../interfaces/DeviceIssueResponseInterface";
import { IssueStatusEnumColor } from "../../interfaces/IssueForm";
import { IssueInformation } from "./IssueInformation";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import { IIssueEditResponse } from "../IssueDashboard/Components/IssueEditModule/Interface/IssueCommentInterface";
import { IssueEditResponseInitialState } from "../IssueDashboard/Components/IssueEditModule/Initialstate/IssueEditResponseInitialstate";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

function dateDiff(createdAt: number, updatedAt: number): string {

  const diffMs = updatedAt == null ? Math.abs(new Date().getTime() -  createdAt) : Math.abs(updatedAt - createdAt);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const remainingHours = diffHours % 24;
  const remainingMinutes = diffMinutes % 60;

  let str = '';
  if (diffDays > 0) str += `${diffDays}d `;
  if (remainingHours > 0) str += `${remainingHours}h `;
  if (remainingMinutes > 0) str += `${remainingMinutes}m`;

  return str.trim() || '0m';
}


type FilterOption = "htol" | "ltoh";

interface ISelectFilter{
    // filterTime: FilterOption | null,
    setFilterTime: (value: FilterOption | null)=> void
}


export const SelectFilterComponent: React.FC<ISelectFilter> = ({setFilterTime}) =>{

    return(
        <Select onChange={(e)=> setFilterTime(e.target.value as FilterOption)}>
            <option value="">Select Filter</option>
            <option value="htol">High To Low</option>
            <option value="ltoh">Low To High</option>
        </Select>
    )
}

export const AllIssueDashboard = () => {

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const {data,isLoading,isSuccess} = GetAllIssues();
    const [issueEditData,setIssueData] = useState<IIssueEditResponse>(IssueEditResponseInitialState);
    const {isOpen,onClose,onOpen} = useDisclosure();
    const {userDetail} = useContext(UserDetailContext);
    const [filterTime,setFilterTime] = useState<FilterOption | null>(null);
    const [filteredIssueData,setFilteredIssueData] = useState<IDeviceIssueResponseInterface[] | undefined>([]);
    const [startDate,setStartDate] = useState<string>("");
    const [endDate,setEndDate] = useState<string>(formattedToday);

    const allIssueData = useMemo(()=>{
        return data?.data.data.sort((a,b)=> b.createdAt - a.createdAt);
    },[data]);

    const handleInfo = (response:IIssueEditResponse) =>{
        setIssueData(response);
        onOpen();
    }


    const columns:DataTableColumnInterface<IDeviceIssueResponseInterface>[] = [
        {
            accessorKey: "ticketId",
            header: "Ticket ID",
            cell: (props) => <span className="font-mono text-xs font-semibold text-gray-700">{(props.getValue() as string) || "—"}</span>
        },
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
            accessorKey: "createdAt",
            header: "Picked At",
            cell: (props) => <>{getCutomTimeStampTODate(props.getValue())}</>
        },
        {
            accessorKey: "issueStatus",
            header: "Status",
            cell: (props) => {
                const status = props.getValue() as keyof typeof IssueStatusEnumColor;
                const color = IssueStatusEnumColor[status];
                return (
                    <h3 style={{backgroundColor: color}} className="px-3 py-1 rounded-md w-fit">
                        {status}
                    </h3>
                );
            }
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: (props) => <button onClick={() => handleInfo(props.row.original)} className="flex items-center justify-center px-3 py-3 rounded-md bg-primaryDark">{IconComponents.editIcon}</button>
        }
    ];

   if (userDetail?.data?.result?.roleId === 19) {
        columns.splice(
        columns.length - 2,
        0,
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: (props) => <>{props.getValue() == null ? "No Status Yet" : getCutomTimeStampTODate(props.getValue())}</>,
        },
        {
            accessorKey: "noteId",
            header: "Task Duration",
            cell: (props) => <span className="font-medium text-sm">{dateDiff(props.row.original.createdAt,props.row.original.updatedAt)}</span>,
        },
        );
    }
    const filteredData = useCallback(() => {
        if (!allIssueData) return;

        const start = startDate ? new Date(startDate).getTime() : 0;
        const end = new Date(endDate).getTime();

        let data = allIssueData.filter(item => {
            const postTime = new Date(item.createdAt).getTime();
            return postTime >= start && postTime <= end;
        });

        if (filterTime === "htol") {
            data.sort((a, b) => {
                const gapA = (a.updatedAt ? new Date(a.updatedAt).getTime() : new Date().getTime()) - new Date(a.createdAt).getTime();
                const gapB = (b.updatedAt ? new Date(b.updatedAt).getTime() : new Date().getTime()) - new Date(b.createdAt).getTime();
                return gapB - gapA; // largest gap first
            });
        } else if (filterTime === "ltoh") {
            data.sort((a, b) => {
                const gapA = (a.updatedAt ? new Date(a.updatedAt).getTime() : new Date().getTime()) - new Date(a.createdAt).getTime();
                const gapB = (b.updatedAt ? new Date(b.updatedAt).getTime() : new Date().getTime()) - new Date(b.createdAt).getTime();
                return gapA - gapB; // smallest gap first
            });
        }

        setFilteredIssueData(data);
    }, [filterTime, allIssueData, startDate, endDate]);

    useEffect(() => {
        filteredData();
    }, [filteredData, isSuccess,endDate,startDate]);

    return(
        <>
            <DataTable
                columns={columns}
                data={filteredIssueData}
                tableHeadCss="bg-dark"
                tableCss="border border-zinc-400 rounded-xl"
                headerClassName="text-gray-300 font-bold py-2  text-left"
                bodyClassName="border-b border-gray-300 py-2 text-left px-2"
                isLoading={isLoading}
                additionalHeader={userDetail.data.result.roleId == 20 && true}
                additionHeaderComponent={[
                    <Input max={formattedToday} value={startDate} onChange={(e)=> setStartDate(e.target.value)} type="date" variant='outline' placeholder='Outline' />,
                    <Input max={new Date().toISOString().split('T')[0]} value={endDate} onChange={(e)=> setEndDate(e.target.value)} type="date" variant='outline' placeholder='Outline' />,
                     <SelectFilterComponent setFilterTime={setFilterTime}/>
                    ]}
            />

            {
                isOpen &&
                <IssueInformation item={issueEditData} isOpen={isOpen} onClose={onClose} />
            }
        </>
    )
}