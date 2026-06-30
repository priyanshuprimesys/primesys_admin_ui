import { IAddDivisionDevicesInterface } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AddDivisionDevicesInterface";

export const AddDivisionDevicesInitialState: IAddDivisionDevicesInterface = {
  deviceImei: 0,
  divisionId: "",
  deviceName: "",
  deviceNo: 0,
  deviceSimNo: "",
  deviceSimImeiNo: "",
  showGoogleAddress: false,
  reportAsIndependentRdps: false,
  deviceTypeId: 0,
  reportTimeMargin: 0,
  onTrackMargin: 0,
  reportDistMargin: 0,
  activationDate: 0,
  deviceUserType: "",
  tripWiseReport: false,
  simServiceProvider: "",
  updatedBy: "",
};
