import { useState } from "react"
import { HeaderRouteNameContext } from "./HeaderRouteNameContext"










export const HeaderRouteNameProvider = ({children}:any) =>{

    const [headerComponentName,setHeaderComponentName] = useState<string>('Home');


    return(
        <HeaderRouteNameContext.Provider value={{ headerComponentName,setHeaderComponentName }}>
            {children}
        </HeaderRouteNameContext.Provider>
    )
}