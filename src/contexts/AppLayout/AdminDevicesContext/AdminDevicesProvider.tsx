import { useState } from "react"
import { AdminDevicesContext } from "./AdminDevicesContext"
import { IAdminDeviceLocationResponse, IAdminDevicesResponse } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface"
import { AdminDeviceLocationResponse, AdminDevicesResponseInitialState } from "../../../initialStates/AppInitialStates/AllDivisionDevicesInitialState/AdminDevicesInitialState"





export const AdminDevicesProvider = ({children}:any) => {

    const [adminDevices,setAdminDevices] = useState<IAdminDevicesResponse>(AdminDevicesResponseInitialState);
    const [adminDeviceLocation,setAdminDeviceLocation] = useState<IAdminDeviceLocationResponse>(AdminDeviceLocationResponse)

  return (
    <AdminDevicesContext.Provider value={{
        adminDevices,setAdminDevices,
        adminDeviceLocation, setAdminDeviceLocation
    }}>
        {children}
    </AdminDevicesContext.Provider>
  )
}
