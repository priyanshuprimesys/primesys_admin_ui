import { createContext } from "react";
import { AdminDeviceLocationResponse, AdminDevicesResponseInitialState } from "../../../initialStates/AppInitialStates/AllDivisionDevicesInitialState/AdminDevicesInitialState";
import { IAdminDeviceLocationResponse, IAdminDevicesResponse } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface";



interface IAdmin{
    adminDevices: IAdminDevicesResponse,
    setAdminDevices: React.Dispatch<React.SetStateAction<IAdminDevicesResponse>>,
    adminDeviceLocation: IAdminDeviceLocationResponse,
    setAdminDeviceLocation: React.Dispatch<React.SetStateAction<IAdminDeviceLocationResponse>>
};

const defaultValue:IAdmin={
    adminDevices: AdminDevicesResponseInitialState,
    setAdminDevices:() =>{},
    adminDeviceLocation: AdminDeviceLocationResponse,
    setAdminDeviceLocation:() =>{}
}



export const AdminDevicesContext = createContext(defaultValue);