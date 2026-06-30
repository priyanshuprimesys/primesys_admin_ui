import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { useGetIssueDataById } from "../../../../hooks/getIssueDataById";
import { DataTableColumnInterface } from "../../../../../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { IDeviceIssueByIdInterface } from "../../../../interfaces/DeviceIssueDetailsByIdInterface";
import DataTable from "../../../../../../../global/components/DataTable/DataTable";
import { getCutomTimeStampTODate } from "../../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { IconComponents } from "../../../../../../../global/Icons/IconsStore";
import { Button, useDisclosure } from "@chakra-ui/react";
import { IssueEditModule } from "../IssueEditModule/Index";
import { IIssueEditResponse } from "../IssueEditModule/Interface/IssueCommentInterface";
import { IssueEditResponseInitialState } from "../IssueEditModule/Initialstate/IssueEditResponseInitialstate";
import { IssueStatusEnumColor } from "../../../../interfaces/IssueForm";
import { IssueCreateNewModel } from "../IssueEditModule/components/IssueCreateNewModel";
import { BiPlus } from "react-icons/bi";
import { IssueContext } from "../../../../context/IssueContext/IssueContext";





const IssueTable = () =>{

    const {userDetail} = useContext(UserDetailContext);
    const {setUserPerMessages} = useContext(IssueContext);
    const  {data,isSuccess} = useGetIssueDataById(userDetail.data.result.divisionId);
    const {isOpen,onClose,onOpen} = useDisclosure();
    const {isOpen:createOpen,onClose:onCreateClose,onOpen:onCreateOpen} = useDisclosure();
    const [issueEditData,setIssueData] = useState<IIssueEditResponse>(IssueEditResponseInitialState);

    const handleEdit = (response:IIssueEditResponse)=>{
        setIssueData(response);
        onOpen();
    }

    const handleCreate = () =>{
        onCreateOpen()
    }

    const columns:DataTableColumnInterface<IDeviceIssueByIdInterface>[] = [
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
            cell: (props) => <button onClick={() => handleEdit(props.row.original)} className="flex items-center justify-center px-3 py-3 rounded-md bg-primaryDark">{IconComponents.editIcon}</button>
        }
    ];

 

    useEffect(()=>{
        if(isSuccess && data.data){
            setUserPerMessages(data?.data?.data);
        }
    },[isSuccess,data]);

    const statusOrder = ["SOFTCLOSE","CLOSE","UNDEROBSERVATION","INPROGRESS","OPEN"];


    return(
        <>
            <DataTable
                additionalHeader={true}
                additionHeaderComponent={[<Button onClick={()=> handleCreate()} className="!bg-primaryDark !text-white">Create <BiPlus size={24} /> </Button>]}
                columns={columns}
                data={data?.data ?  data.data.data.sort((a,b)=> b.createdAt - a.createdAt).sort((a,b)=> statusOrder.indexOf(b.issueStatus) - statusOrder.indexOf(a.issueStatus) ) : []}
                tableHeadCss="bg-dark"
                tableCss="border border-zinc-400 rounded-xl"
                headerClassName="text-gray-300 font-bold py-2  text-left"
                bodyClassName="border-b border-gray-300 py-2 text-left px-2"
            />

            {
                isOpen &&
                <IssueEditModule issueEditData={issueEditData} isOpen={isOpen} onClose={onClose} />
            }
            
            {
                createOpen && <IssueCreateNewModel 
                
                isOpen={createOpen} onClose={onCreateClose} 
                />
            }
        </>
    )
}



export default IssueTable;