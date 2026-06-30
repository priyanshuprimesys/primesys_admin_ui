import { useState } from "react"
import { UserDetailContext } from "./UserDetailContext"
import { UserDetailInterface } from "../../../interfaces/AppInterfaces/UserDetailInterface/UserDetailInterface";
import { UserDetailInitialState } from "../../../initialStates/UserDetailInitialState/UserDetailInitialState";














export const UserDetailProvider = ({children}:any) =>{

    const [userDetail,setUserDetail] = useState<UserDetailInterface>(UserDetailInitialState);




    return(
        <>
        <UserDetailContext.Provider value={{ userDetail,setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
        </>
    )
}