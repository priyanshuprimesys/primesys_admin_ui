import { IIssueInterface } from "../interfaces/DeviceIssueInterface";


const IssueMsgGroup = (msgGroup:IIssueInterface[]) =>{
    const chatMessages = Object.groupBy(msgGroup,({groupName})=> groupName);
    return {chatMessages}
}


export default IssueMsgGroup;



