import { useState } from "react"
import { IssueTrackingContext } from "./IssueTrackingContext"






export const IssueTrackingProvider = ({children}:any) => {

    const [parentDivisionId,setParentDivisionId] = useState<string>("");
    const [studentDeviceNo,setStudentDeviceNo] = useState<string>("")

    return(
        <IssueTrackingContext.Provider value={{
            parentDivisionId,setParentDivisionId,
            studentDeviceNo,setStudentDeviceNo
        }}>
            {children}
        </IssueTrackingContext.Provider>
    )
}