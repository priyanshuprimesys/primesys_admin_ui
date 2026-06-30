import { createContext } from "react";
import { UserDetailInitialState } from "../../../initialStates/UserDetailInitialState/UserDetailInitialState";
import { UserDetailInterface } from "../../../interfaces/AppInterfaces/UserDetailInterface/UserDetailInterface";





interface UserContextInterface{
    userDetail: UserDetailInterface;
    setUserDetail: React.Dispatch<React.SetStateAction<UserDetailInterface>>;
}



const defaultUserValue:UserContextInterface ={
    userDetail:UserDetailInitialState,
    setUserDetail:() =>{}
}



export const UserDetailContext = createContext(defaultUserValue);