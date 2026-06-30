export interface IAddDivisionDevicesInterface {
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
  activationDate: number;
  deviceUserType: string;
  tripWiseReport: boolean;
  simServiceProvider: string;
  updatedBy: string;
}
export interface IAddDivisionFormikDevicesInterface {
  deviceImei: string;
  divisionId: string;
  deviceName: string;
  deviceNo: string;
  deviceSimNo: string;
  deviceSimImeiNo: string;
  showGoogleAddress: boolean;
  reportAsIndependentRdps: boolean;
  deviceTypeId: number;
  reportTimeMargin: string;
  onTrackMargin: string;
  reportDistMargin: string;
  activationDate: any;
  deviceUserType: string;
  tripWiseReport: boolean;
  simServiceProvider: string;
  updatedBy: string;
  shiftType:number;
  reportEnable:boolean;
  deviceVersion: string;
}
