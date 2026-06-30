export interface IUpdateDivisionDevicesInterface {
  id:string;
  deviceImei: number;
  divisionId: string;
  deviceName: string;
  deviceNo: number;
  deviceSimNo: string;
  deviceSimImeiNo: string;
  showGoogleAddress: boolean;
  reportAsIndependentRdps: boolean;
  deviceTypeId: number;
  reportTimeMargin: number;
  onTrackMargin: number;
  reportDistMargin: number;
  activationDate: any;
  deviceUserType: string;
  tripWiseReport: boolean;
  simServiceProvider: string;
  updatedBy: string;
  shiftType:number;
  reportEnable:boolean
  activeStatus:boolean;
  deviceVersion: string;
}
export interface IUpdateFormikDivisionDevicesInterface {
  deviceImei: string;
  divisionId: string;
  deviceName: string;
  deviceNo: string;
  deviceSimNo: string;
  deviceSimImeiNo: string;
  showGoogleAddress: boolean;
  reportAsIndependentRdps: boolean;
  deviceTypeId: string;
  reportTimeMargin: string;
  onTrackMargin: string;
  reportDistMargin: string;
  activationDate: string;
  deviceUserType: string;
  tripWiseReport: boolean;
  simServiceProvider: string;
  updatedBy: string;
}
