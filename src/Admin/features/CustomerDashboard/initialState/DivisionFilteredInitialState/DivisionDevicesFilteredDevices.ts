import { IDivisionFilteredDetailDevicesInterface } from "../../interfaces/DivisionFilteredDevices/DivisionFilteredDevicesInterface";

export const DivisionDevicesFilteredDeviceInitialState:IDivisionFilteredDetailDevicesInterface={
    data:{
        result:[{
            deviceId: "",
            validDay: 0,
            name: "",
            imeiNo: 0,
            deviceTypeId: 0,
            deviceUsertype: "",
            deviceSimImeiNo: "",
            deviceNo: 0,
            simNo: "",
            lat: 0,
            lon: 0,
            speed: 0,
            timestamp: 0,
            deviceStatus: ""
        }]
    }
}