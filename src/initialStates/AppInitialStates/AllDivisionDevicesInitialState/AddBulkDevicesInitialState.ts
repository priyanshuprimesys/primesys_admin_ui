import { IAddBulkDevicesInterface } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AddBulkDevicesInterface";

export const AddBulkDeviceUploadInitialState: IAddBulkDevicesInterface = {
  file: "",
  device: {
    deviceTypeId: 0,
    divisionId: "",
    onTrackMargin: 0,
    reportAsIndependentRdps: false,
    reportDistMargin: 0,
    reportTimeMargin: 0,
    showGoogleAddress: false,
    deviceUserType: "",
    simServiceProvider: "",
    deviceVersion: "",
  },
  deviceStartSerialNo: 0,
};
