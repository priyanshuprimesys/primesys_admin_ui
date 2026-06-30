import { createContext } from "react";
import { LoginDivisionTrackUserDetailInitialState } from "../../../../initialStates/AppInitialStates/Login_Division_Track_User_InitialState/LoginDivisionTrackUserDetailInitialState";
import { ILoginTrackUserDetailInterface } from "../../../../interfaces/AppInterfaces/IDivision_Login_Track_Users_Detail_Interface/ILoginTrackUserDetailInterface"








interface DivisionLoginTrackUser{
    divisionLoginTrackUserDetails:ILoginTrackUserDetailInterface
    setDivisionLoginTrackUserDetail: React.Dispatch<React.SetStateAction<ILoginTrackUserDetailInterface>>;
    divisionParentName:string;
    setDivisionParentName: React.Dispatch<React.SetStateAction<string>>;
}




const DivisionLoginDefaultValue:DivisionLoginTrackUser = {
    divisionLoginTrackUserDetails:LoginDivisionTrackUserDetailInitialState,
    setDivisionLoginTrackUserDetail:() =>{},
    divisionParentName:'',
    setDivisionParentName:() =>{}
}


export const DivisionLoginTrackUsersContext = createContext(DivisionLoginDefaultValue);