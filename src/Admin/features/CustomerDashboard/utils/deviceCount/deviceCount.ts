import { IDivisionDevicesDetailResponseInterface } from "../../interfaces/DivisionAllDevices/DivisionDevicesDetailResponseInterface";
import { IDivisionDevicesLocationDetailsInterface } from "../../interfaces/DivisionDevicesLocation/DivisionDevicesLocationDetailsInterface";
import { isDeviceActive, isDeviceActiveToday, isDeviceOffSince48hrs, isDeviceOffToday } from "../deviceStatusTime/deviceStatusTime";




export function getDeviceAllCount(devices:IDivisionDevicesDetailResponseInterface){
    return devices.data.result.length;
}

export async function getOnDeviceCount(devices:IDivisionDevicesLocationDetailsInterface):Promise<number>{
    return devices.data.result.filter(device => isDeviceActive(device.timestamp)).length;
}

export async function getOnTodayDeviceCount(devices:IDivisionDevicesLocationDetailsInterface):Promise<number>{
    return devices.data.result.filter(device=> isDeviceActiveToday(device.timestamp)).length;
}

export async function getOffTodayDeviceCount(devices:IDivisionDevicesLocationDetailsInterface):Promise<number>{
    return devices.data.result.filter(device=> isDeviceOffToday(device.timestamp)).length;
}

export async function getLastOff48hrs(devices:IDivisionDevicesLocationDetailsInterface):Promise<number>{
    return devices.data.result.filter(device=> isDeviceOffSince48hrs(device.timestamp)).length;
}