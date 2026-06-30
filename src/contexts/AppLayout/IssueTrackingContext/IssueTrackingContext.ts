import { createContext } from "react";




interface IssueEditTracking{
    parentDivisionId:string;
    setParentDivisionId: React.Dispatch<React.SetStateAction<string>>;
    studentDeviceNo:string;
    setStudentDeviceNo: React.Dispatch<React.SetStateAction<string>>;
}

const defaultValue: IssueEditTracking={
    parentDivisionId:'',
    setParentDivisionId:()=> {},
    studentDeviceNo:"",
    setStudentDeviceNo:()=>{}
}


export const IssueTrackingContext = createContext(defaultValue);