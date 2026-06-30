import { useState } from "react"
import { AuthenticationContext } from "./AuthenticationContext";





export const AuthenticationContextProvider = ({children}:any) =>{


    const [isAuthenticated, SetIsAuthenticated]  = useState<boolean>(false);


    return(
        <>
        <AuthenticationContext.Provider value={{ isAuthenticated, SetIsAuthenticated }}>
            {children}
        </AuthenticationContext.Provider>
        </>
    )
}