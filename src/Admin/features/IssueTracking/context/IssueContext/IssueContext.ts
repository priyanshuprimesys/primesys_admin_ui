import { createContext } from "react";
import { IIssueInterface } from "../../interfaces/DeviceIssueInterface";
import { IssueInitialState } from "../../initialState/IssueInitialState";
import { IDeviceIssueResponseInterface } from "../../interfaces/DeviceIssueResponseInterface";





interface IssueInterface{
    issueMessageData:IIssueInterface[];
    setIssueMessageData: React.Dispatch<React.SetStateAction<IIssueInterface[]>>;
    issueHeader:string;
    setIssueHeader: React.Dispatch<React.SetStateAction<string>>;
    isExpand:boolean;
    setIsExpand: React.Dispatch<React.SetStateAction<boolean>>;
    totalGroups: number;
    setTotalGroups: React.Dispatch<React.SetStateAction<number>>;
    userPerMessages:IDeviceIssueResponseInterface[],
    setUserPerMessages: React.Dispatch<React.SetStateAction<IDeviceIssueResponseInterface[]>>
}

const defaultValue:IssueInterface={
    issueMessageData:[IssueInitialState],
    setIssueMessageData:() =>{},
    issueHeader:'',
    setIssueHeader:()=>{},
    isExpand:false,
    setIsExpand:() =>{},
    totalGroups:0,
    setTotalGroups:()=>{},
    userPerMessages:[],
    setUserPerMessages:()=> {}
}


export const IssueContext = createContext(defaultValue);