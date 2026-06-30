import { useRef } from "react"
import { DeviceFamilyNumberCommandContext } from "./DeviceFamilyNumberCommandContext"











export const DeviceFamilyNumberCommandProvider = ({children}:any) =>{

    const familyNumberOneRef = useRef<HTMLInputElement | null>(null);
    const familyNumberTwoRef = useRef<HTMLInputElement | null>(null);
    const familyNumberThreeRef = useRef<HTMLInputElement | null>(null);

    return(
        <DeviceFamilyNumberCommandContext.Provider value={{ 
            familyNumberOneRef,familyNumberTwoRef,familyNumberThreeRef
         }}>
            {children}
        </DeviceFamilyNumberCommandContext.Provider>
    )
}