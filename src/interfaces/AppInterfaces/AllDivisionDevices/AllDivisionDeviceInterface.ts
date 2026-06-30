import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IAllDivisionDeviceInterface {
  deviceId: string;
  validDay: number;
  name: string;
  imeiNo: number;
  showGoogleAddress: boolean;
  simNo: string;
  studentId: number;
  deviceTypeId: number;
  deviceUsertype: string;
  isDeviceConnected: boolean;
  deviceNo: number;
  divisionId: string;
  divisionName:string;
}
export interface ___IAllDivisionDeviceInterface {
  deviceId: string;
  validDay: number;
  name: string;
  imeiNo: number;
  showGoogleAddress: boolean;
  simNo: string;
  deviceTypeId: number;
  deviceUsertype: string;
  deviceNo: number;
  divisionId: string;
}



export interface IAdminDevicesInterface{
  deviceId:string;
  deviceNo:number;
  deviceTypeId:number;
  deviceUsertype:string;
  divisionId:string;
  divisionName:string;
  imeiNo:number;
  name:string;
  showGoogleAddress:boolean
  simNo:string;
  validDay:number;
  version?:any;
  simServiceProvider?:any;
  deviceSimImeiNo?:string;
}


export interface IAdminDeviceLocation{
  deviceImei:number;
  deviceUserType:string;
  lat:number;
  latDirection:string;
  lon:number;
  lonDirection:string;
  name:string
  speed:number;
  timestamp:number;
}




export interface IAdminDevicesResponse extends SuccessInterface{
  data:{
    result:IAdminDevicesInterface[]
  }
}



export interface IAdminDeviceLocationResponse extends SuccessInterface{
  data:{
    result: IAdminDeviceLocation[]
  }
}