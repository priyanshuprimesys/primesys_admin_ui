import { createContext } from "react"





interface IIssueEditContext{
    deviceImei:string,
    setDeviceImei: React.Dispatch<React.SetStateAction<string>>
}

const defaultValue: IIssueEditContext={
    deviceImei:"",
    setDeviceImei:() =>{}
}


export const IssueEditModuleContext = createContext(defaultValue);