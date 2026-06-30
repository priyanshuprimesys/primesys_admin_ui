import { createContext } from "react";
import { DivisionDevicesDetailResponseInitialState } from "../../initialState/DivisionDevicesInitialState/DivisionDevicesResponseInitialState";
import { IDivisionDevicesDetailResponseInterface } from "../../interfaces/DivisionAllDevices/DivisionDevicesDetailResponseInterface";




interface DivisionDeviceInterface{
    customerDivisionDevices: IDivisionDevicesDetailResponseInterface,
    setCustomerDivisionDevices: React.Dispatch<React.SetStateAction<IDivisionDevicesDetailResponseInterface>>;
}


const DivisionDevicesValue:DivisionDeviceInterface={
    customerDivisionDevices: DivisionDevicesDetailResponseInitialState,
    setCustomerDivisionDevices:()=> {}
}



export const CustomerDivisionDevicesContext = createContext(DivisionDevicesValue);