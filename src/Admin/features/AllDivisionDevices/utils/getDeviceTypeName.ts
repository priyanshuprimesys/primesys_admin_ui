export function getDeviceTypeName(deviceType:number){
    let deviceName:string = '';
    if(deviceType === 0)
    {
        deviceName = "Default";
    }
    if(deviceType === 1){
        deviceName = "KeyMan";
    }
    else if(deviceType === 2){
        deviceName = "PatrolMan";
    }
    else if(deviceType === 3){
        deviceName = "USFD";
    }
    else if(deviceType === 4){
        deviceName = "Mate";
    }
    else if(deviceType === 5){
        deviceName = "GateMitra";
    }
    else if(deviceType === 6){
        deviceName = "Stationery Watchman";
    }
    else if(deviceType === 7){
        deviceName = "TRD PatrolMan";
    }

    return deviceName;
    
}