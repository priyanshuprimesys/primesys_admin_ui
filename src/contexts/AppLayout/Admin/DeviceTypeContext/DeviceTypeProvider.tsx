import { useState } from "react";
import { IDeviceTypeResponse } from "../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";
import { DeviceTypeContext } from "./DeviceTypeContext";


export const DeviceTypeProvider = ({ children }: any) => {
    const [deviceType, setDeviceType] = useState<IDeviceTypeResponse | null>(null);
    return (
        <DeviceTypeContext.Provider value={{
            deviceType, setDeviceType
        }}>
            {children}
        </DeviceTypeContext.Provider>
    )
}