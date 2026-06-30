import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IAddBulkDeviceInformationInterface {
  deviceTypeId: number;
  divisionId: string;
  onTrackMargin: number;
  reportAsIndependentRdps: boolean;
  reportDistMargin: number;
  reportTimeMargin: number;
  showGoogleAddress: boolean;
  deviceUserType: string;
  simServiceProvider: string;
  deviceVersion: string;
}

export interface IAddBulkDevicesInterface {
  file: string;
  device: IAddBulkDeviceInformationInterface;
  deviceStartSerialNo: number;
}

export interface IAddBulkDeviceResponseInterface extends SuccessInterface {
  data: {
    result: {
      validRecords: number;
      invalidRecords: number;
      errorDescription: any;
    };
  };
  error: {
    code: number;
    message: string;
  };
}
