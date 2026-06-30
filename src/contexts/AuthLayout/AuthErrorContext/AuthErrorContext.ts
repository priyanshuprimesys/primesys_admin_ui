import { createContext } from "react";



interface AuthErrorProps{
    errorMessage:string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    errorState:boolean;
    setErrorState: React.Dispatch<React.SetStateAction<boolean>>;
}


const defaultValue: AuthErrorProps = {
    errorMessage:'',
    setErrorMessage:() =>{},
    errorState:false,
    setErrorState:() => {}
}



export const AuthErrorContext = createContext(defaultValue);