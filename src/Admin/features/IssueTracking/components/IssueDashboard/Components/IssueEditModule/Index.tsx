import IssueEditModal from "./components/IssueEditModal";
import { IIssueEditResponse } from "./Interface/IssueCommentInterface";


interface IssueEditModuleInterface{
    isOpen:boolean;
    onClose:()=> void;
    issueEditData: IIssueEditResponse
}


export const IssueEditModule: React.FC<IssueEditModuleInterface> = ({isOpen,onClose,issueEditData}) =>{
    return(
        <>
            <IssueEditModal issueEditData={issueEditData} isOpen={isOpen} onClose={onClose} />
        </>
    )
}