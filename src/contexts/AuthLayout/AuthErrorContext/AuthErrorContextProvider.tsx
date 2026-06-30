import { useState } from "react"
import { AuthErrorContext } from "./AuthErrorContext";







export const AuthErrorContextProvider = ({children}:any) =>{

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorState, setErrorState] = useState<boolean>(false);

    return(
        <>
        <AuthErrorContext.Provider value={{ errorMessage,errorState,setErrorMessage,setErrorState }}>
            {children}
        </AuthErrorContext.Provider>
        </>
    )
}