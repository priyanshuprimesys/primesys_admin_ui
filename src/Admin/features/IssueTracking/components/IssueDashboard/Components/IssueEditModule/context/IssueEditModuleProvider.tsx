import { useState } from "react"
import { IssueEditModuleContext } from "./IssueEditModuleContext"







export const IssueEditModuleProvider = ({children}:any) =>{

    const [deviceImei,setDeviceImei] = useState<string>("");

    return(
        <IssueEditModuleContext.Provider value={{
            deviceImei,setDeviceImei
        }}>
            {children}
        </IssueEditModuleContext.Provider>
    )
}