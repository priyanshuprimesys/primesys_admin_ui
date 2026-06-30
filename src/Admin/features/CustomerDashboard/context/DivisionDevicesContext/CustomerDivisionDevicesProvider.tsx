import { useState } from "react";
import { CustomerDivisionDevicesContext } from "./CustomerDivisionDevicesContext";
import { IDivisionDevicesDetailResponseInterface } from "../../interfaces/DivisionAllDevices/DivisionDevicesDetailResponseInterface";
import { DivisionDeviceDetailResponseInitialState } from "../../initialState/DivisionDevices/DivisionDevicesDetailResponseInitialState";




const CustomerDivisionDevicesProvider = ({children}:any) =>{

    const [customerDivisionDevices,setCustomerDivisionDevices] = useState<IDivisionDevicesDetailResponseInterface>(DivisionDeviceDetailResponseInitialState);

    return(
        <CustomerDivisionDevicesContext.Provider value={{
            customerDivisionDevices,setCustomerDivisionDevices
        }}>
            {children}
        </CustomerDivisionDevicesContext.Provider>
    )
}



export default CustomerDivisionDevicesProvider;