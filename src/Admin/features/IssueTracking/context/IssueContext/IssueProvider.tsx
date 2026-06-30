import { useState } from "react";
import { IssueContext } from "./IssueContext";
import { IIssueInterface } from "../../interfaces/DeviceIssueInterface";
import { IDeviceIssueResponseInterface } from "../../interfaces/DeviceIssueResponseInterface";




const IssueProvider = ({children}:any) =>{
    
    const [issueMessageData,setIssueMessageData] = useState<IIssueInterface[]>([{
        id: "",
        sender: "",
        groupName: "",
        senderName: "",
        message: "",
        noteId: "",
        postTime: 0,
        isIssue: false,
        activeStatus: false,
        divisionId:""
    }]);

    const [issueHeader,setIssueHeader] = useState<string>("");
    const [isExpand,setIsExpand] = useState<boolean>(false);
    const [totalGroups,setTotalGroups] = useState<number>(0);
    const [userPerMessages,setUserPerMessages] = useState<IDeviceIssueResponseInterface[]>([]);

    return (
        <IssueContext.Provider value={{
            issueMessageData,setIssueMessageData,
            issueHeader,setIssueHeader,
            isExpand,setIsExpand,
            totalGroups,setTotalGroups,
            userPerMessages,setUserPerMessages
        }}>
            {children}
        </IssueContext.Provider>
    )
}


export default IssueProvider;