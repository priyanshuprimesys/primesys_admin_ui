import { createContext } from "react";
import { IDeviceTypeResponse } from "../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";


interface IDeviceTypeContext {
    deviceType: IDeviceTypeResponse | null;
    setDeviceType: React.Dispatch<React.SetStateAction<IDeviceTypeResponse | null>>
}





const defaultDeviceCommandValue: IDeviceTypeContext = {
    deviceType: null,
    setDeviceType: () => { }
}



export const DeviceTypeContext = createContext(defaultDeviceCommandValue);