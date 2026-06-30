import { createContext } from "react";



interface AuthLoaderProps{
    isAuthLoading: boolean;
    SetIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>
}



const defaultValue: AuthLoaderProps ={
    isAuthLoading:false,
    SetIsAuthLoading:() =>{}
}



const AuthLoaderContext = createContext(defaultValue);


export default AuthLoaderContext;