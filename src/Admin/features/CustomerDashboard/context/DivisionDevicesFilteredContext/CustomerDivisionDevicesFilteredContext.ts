import { createContext } from "react";
import { DivisionDevicesFilteredDeviceInitialState } from "../../initialState/DivisionFilteredInitialState/DivisionDevicesFilteredDevices";
import { IDivisionFilteredDetailDevicesInterface } from "../../interfaces/DivisionFilteredDevices/DivisionFilteredDevicesInterface";




interface CustomerDivisionFiltered{
    customerDivisionFilteredDevices:IDivisionFilteredDetailDevicesInterface;
    setCustomerDivisionFilteredDevices: React.Dispatch<React.SetStateAction<IDivisionFilteredDetailDevicesInterface>>;
    deviceLoading:boolean;
    setDeviceLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const FilteredDefaultValue:CustomerDivisionFiltered={
    customerDivisionFilteredDevices: DivisionDevicesFilteredDeviceInitialState,
    setCustomerDivisionFilteredDevices:() => {},
    deviceLoading:false,
    setDeviceLoading:()=>{}
}


export const CustomerDivisionDevicesFilteredContext = createContext(FilteredDefaultValue);