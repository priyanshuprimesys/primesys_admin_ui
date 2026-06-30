import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IDivisionDeviceResponseInterface extends SuccessInterface {
  data: {
    result: {
      id: string;
      deviceImei: number;
      reportTimeMargin: number;
      reportDistMargin: number;
      onTrackMargin: number;
      shiftType: number;
      parentId: any;
      divisionId: string;
      studentId: any;
      deviceName: string;
      lastName: any;
      deviceSimNo: string;
      deviceSimImeiNo: string;
      deviceNo: number;
      showGoogleAddress: boolean;
      reportAsIndependentRdps: boolean;
      version: any;
      devicePayment: any;
      location: any;
      createdAt: any;
      lastModified: any;
      deviceTypeId: number;
      deviceUserType: string;
      reportEnable: any;
      trackPids: [];
      pidUpdate: any;
      tripWiseReport: boolean;
      simServiceProvider: string;
      activationDate: number;
      updatedBy: string;
      updatedAt: number;
    };
  };
  error: {
    code: number;
    message: string;
  };
}
