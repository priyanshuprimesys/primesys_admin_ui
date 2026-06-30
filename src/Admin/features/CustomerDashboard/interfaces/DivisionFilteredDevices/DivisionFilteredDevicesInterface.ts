export interface IDivisionFilteredDevice{
    deviceId:string;
    validDay:number;
    name:string;
    imeiNo:number;
    deviceTypeId:number,
    deviceUsertype:string,
    deviceSimImeiNo:string,
    deviceNo:number;
    simNo: string,
    lat: number,
    lon: number,
    speed: number,
    timestamp: number,
    deviceStatus:string;
}


export interface IDivisionFilteredDetailDevicesInterface{
    data:{
        result:IDivisionFilteredDevice[]
    }
}