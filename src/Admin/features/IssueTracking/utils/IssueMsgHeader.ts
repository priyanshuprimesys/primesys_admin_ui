import { IIssueInterface } from "../interfaces/DeviceIssueInterface";

const IssueHeader = (msgGroup:IIssueInterface[]) =>{
    const chatTitles = msgGroup.flat().sort((a,b) => b.postTime - a.postTime).filter((value,index,self)=> index === self.findIndex((t)=>(
        t.groupName === value.groupName
    ))).map((head)=>({
        groupName: head.groupName,
        length: msgGroup.flat().filter((item) => item.groupName === head.groupName).length,
        msgTime: head.postTime
    }));
    return {
        chatTitles
    };
}


export default IssueHeader;