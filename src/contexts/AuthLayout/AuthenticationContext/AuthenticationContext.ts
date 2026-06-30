import { createContext } from "react";


interface AuthenticationProps{
    isAuthenticated:boolean;
    SetIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}


const defaultValue: AuthenticationProps ={
    isAuthenticated:false,
    SetIsAuthenticated:() =>{}
}



export const AuthenticationContext = createContext(defaultValue);