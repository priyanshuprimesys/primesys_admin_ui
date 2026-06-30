import * as yup from "yup";



export const ReplaceDeviceValidation = yup.object().shape({
    oldImeiNo: yup.number().required("Old Imei number is required"),
    newImeiNo: yup.number().required("New Imei is required")
})