import * as yup from "yup";

export const AddDivisionSingleDeviceValidation = yup.object().shape({
  deviceImei: yup.number().required("Device Imei is required"),
  divisionId: yup.string().required("Division Id is required"),
  deviceName: yup.string().required("Device Name is required"),
  deviceNo: yup.number().required("Device Number is required"),
  deviceSimNo: yup.string().required("Device Sim No is required"),
  deviceSimImeiNo: yup.string().required("Device Sime Imei No is required"),
  showGoogleAddress: yup.boolean().optional(),
  reportAsIndependentRdps: yup.boolean().optional(),
  deviceTypeId: yup.number().required("Device Type is required"),
  reportTimeMargin: yup.number().required("Report Time Margin"),
  onTrackMargin: yup.number().required("Nearest Distance for Rdps"),
  reportDistMargin: yup.number().required("Distance Margin for Report"),
  activationDate: yup.string().required("Report Activation Date is required"),
  deviceUserType: yup.string().required("Device User Type is required"),
  tripWiseReport: yup.boolean().optional(),
  simServiceProvider: yup.string().required("Service Provider is required"),
  shiftType: yup.string().required('Shift type is required'),
  reportEnable: yup.boolean().required("Report enabled is required"),
  deviceVersion: yup.string().required("Device version is required")
});
