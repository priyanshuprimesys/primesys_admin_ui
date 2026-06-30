import * as yup from "yup";



const SUPPORTED_FORMATS = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];



export const BeatBulkUploadValidation = yup.object().shape({
    bStartTime: yup.string().optional(),
    bEndTime: yup.string().optional(),
    file: yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only .xls and .xlsx files are allowed",
      (value) => {
        return value && value instanceof File && SUPPORTED_FORMATS.includes(value.type);
      }
    ),
})