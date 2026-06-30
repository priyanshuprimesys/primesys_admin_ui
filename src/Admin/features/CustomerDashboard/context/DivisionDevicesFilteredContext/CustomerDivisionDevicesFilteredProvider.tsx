import { useState } from "react"
import { CustomerDivisionDevicesFilteredContext } from "./CustomerDivisionDevicesFilteredContext"
import { IDivisionFilteredDetailDevicesInterface } from "../../interfaces/DivisionFilteredDevices/DivisionFilteredDevicesInterface"
import { DivisionDevicesFilteredDeviceInitialState } from "../../initialState/DivisionFilteredInitialState/DivisionDevicesFilteredDevices"








export const CustomerDivisionDevicesFilteredProvider = ({children}:any) =>{

    const [customerDivisionFilteredDevices,setCustomerDivisionFilteredDevices] = useState<IDivisionFilteredDetailDevicesInterface>(DivisionDevicesFilteredDeviceInitialState);
    const [deviceLoading,setDeviceLoading] = useState<boolean>(false);

    return(
        <CustomerDivisionDevicesFilteredContext.Provider value={{
            customerDivisionFilteredDevices,setCustomerDivisionFilteredDevices,
            deviceLoading,setDeviceLoading
        }}>
            {children}
        </CustomerDivisionDevicesFilteredContext.Provider>
    )
}