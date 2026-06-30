import { createContext } from "react";
import { DivisionDevicesLocationDetailInitialState } from "../../initialState/DivisionDevicesLocation/DivisionDeviceLocationDetailInitialState";
import { IDivisionDevicesLocationDetailsInterface } from "../../interfaces/DivisionDevicesLocation/DivisionDevicesLocationDetailsInterface";





interface DivisionDevicesLocation{
    customerDivisionDeviceLocation:IDivisionDevicesLocationDetailsInterface,
    setCustomerDivisionDeviceLocation: React.Dispatch<React.SetStateAction<IDivisionDevicesLocationDetailsInterface>>,
    locationApiCallTime:number;
    setLocationApiCallTime: React.Dispatch<React.SetStateAction<number>>;
}

const DivisionLocationValue:DivisionDevicesLocation={
    customerDivisionDeviceLocation:DivisionDevicesLocationDetailInitialState,
    setCustomerDivisionDeviceLocation:() => {},
    locationApiCallTime:0,
    setLocationApiCallTime:() => {}
}


export const CustomerDivisionDevicesLocationContext = createContext(DivisionLocationValue);