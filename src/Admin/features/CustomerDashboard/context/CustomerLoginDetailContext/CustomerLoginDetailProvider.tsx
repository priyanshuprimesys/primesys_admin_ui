import { useState } from "react"
import { CustomerLoginDetailContext } from "./CustomerLoginDetailContext"






export const CustomerLoginDetailProvider = ({children}:any) =>{

    const [customerEmail,setCustomerEmail] = useState<string>("");
    const [customerPassword,setCustomerPassword] = useState<string>("");
    const [parentUserName,setParentUserName] = useState<string>('');
    const [customerDivisionId,setCustomerDivisonId] = useState<string>('');
    const [loginName,setLoginName] = useState<string>("");
    const [parentId,setParentId] = useState<string>("");
    const [customerLogged,setCustomerLogged] = useState<boolean>(false);

    return(
        <CustomerLoginDetailContext.Provider value={{
           customerEmail,setCustomerEmail,
           customerPassword,setCustomerPassword,
           parentUserName,setParentUserName,
           customerDivisionId,setCustomerDivisonId,
           loginName,setLoginName,
           parentId,setParentId,
           customerLogged,setCustomerLogged
        }}>
            {children}
        </CustomerLoginDetailContext.Provider>
    )
}