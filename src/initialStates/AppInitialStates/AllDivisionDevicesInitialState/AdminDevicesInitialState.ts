import { IAdminDeviceLocation, IAdminDeviceLocationResponse, IAdminDevicesInterface, IAdminDevicesResponse } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface";



export const AdminDevicesInitialState:IAdminDevicesInterface={
    deviceId: "",
    deviceNo: 0,
    deviceTypeId: 0,
    deviceUsertype: "",
    divisionId: "",
    divisionName: "",
    imeiNo: 0,
    name: "",
    showGoogleAddress: false,
    simNo: "",
    validDay: 0
}


export const AdminDevicesResponseInitialState:IAdminDevicesResponse={
    data:{
        result: [AdminDevicesInitialState]
    },
    success:false
}




export const AdminDeviceLocationIntialState:IAdminDeviceLocation={
    deviceImei: 0,
    deviceUserType: "",
    lat: 0,
    latDirection: "",
    lon: 0,
    lonDirection: "",
    name: "",
    speed: 0,
    timestamp: 0
}

export const AdminDeviceLocationResponse:IAdminDeviceLocationResponse={
    data:{
        result: [AdminDeviceLocationIntialState]
    },
    success:false
}