import {useState } from "react";
import { CustomerDivisionDevicesLocationContext } from "./CustomerDivisionDevicesLocationContext";
import { IDivisionDevicesLocationDetailsInterface } from '../../interfaces/DivisionDevicesLocation/DivisionDevicesLocationDetailsInterface';
import { DivisionDevicesLocationDetailInitialState } from "../../initialState/DivisionDevicesLocation/DivisionDeviceLocationDetailInitialState";





const CustomerDivisionDevicesLocationProvider = ({children}:any) =>{

    const [customerDivisionDeviceLocation,setCustomerDivisionDeviceLocation] = useState<IDivisionDevicesLocationDetailsInterface>(DivisionDevicesLocationDetailInitialState);
    const [locationApiCallTime,setLocationApiCallTime] = useState<number>(0);

    return(
        <CustomerDivisionDevicesLocationContext.Provider value={{
            customerDivisionDeviceLocation,setCustomerDivisionDeviceLocation,
            locationApiCallTime,setLocationApiCallTime
        }}>
            {children}
        </CustomerDivisionDevicesLocationContext.Provider>
    )
}


export default CustomerDivisionDevicesLocationProvider;