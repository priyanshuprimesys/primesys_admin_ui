import { useState } from "react"
import { IsRememberContext } from "./IsRememberContext";




export const IsRememberContextProvider = ({children}:any) =>{


    const [isRemember, SetIsRemember] = useState<boolean>(false);

    return(
        <>
        <IsRememberContext.Provider value={{ isRemember,SetIsRemember }}>
            {children}
        </IsRememberContext.Provider>
        </>
    )
}