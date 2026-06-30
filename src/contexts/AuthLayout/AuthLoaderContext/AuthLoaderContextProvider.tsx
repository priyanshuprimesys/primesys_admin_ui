import { useState } from "react"
import AuthLoaderContext from "./AuthLoaderContext";





export const AuthLoaderContextProvider = ({children}:any) =>{
    const [isAuthLoading, SetIsAuthLoading] = useState<boolean>(false);

    return(
        <>
        <AuthLoaderContext.Provider value={{ isAuthLoading, SetIsAuthLoading }}>
            {children}
        </AuthLoaderContext.Provider>
        </>
    )
}