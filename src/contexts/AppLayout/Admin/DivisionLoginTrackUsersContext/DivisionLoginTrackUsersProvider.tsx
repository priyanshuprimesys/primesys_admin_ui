import { useState } from "react"
import { DivisionLoginTrackUsersContext } from "./DivisionLoginTrackUsersContext"
import { ILoginTrackUserDetailInterface } from "../../../../interfaces/AppInterfaces/IDivision_Login_Track_Users_Detail_Interface/ILoginTrackUserDetailInterface"
import { LoginDivisionTrackUserDetailInitialState } from "../../../../initialStates/AppInitialStates/Login_Division_Track_User_InitialState/LoginDivisionTrackUserDetailInitialState"










export const DivisionLoginTrackUsersProvider = ({children}:any) =>{

    const [divisionLoginTrackUserDetails,setDivisionLoginTrackUserDetail] = useState<ILoginTrackUserDetailInterface>(LoginDivisionTrackUserDetailInitialState);
    const [divisionParentName,setDivisionParentName] = useState<string>('');

    return(
        <DivisionLoginTrackUsersContext.Provider 
        value={{ divisionLoginTrackUserDetails,setDivisionLoginTrackUserDetail,
            divisionParentName,setDivisionParentName
         }}>
            {children}
        </DivisionLoginTrackUsersContext.Provider>
    )
}