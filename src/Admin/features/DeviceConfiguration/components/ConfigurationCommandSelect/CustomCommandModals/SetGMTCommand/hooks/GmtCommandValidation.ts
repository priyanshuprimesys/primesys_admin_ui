import * as yup from "yup";



export const GmtCommandValidation = yup.object().shape({
    gmtCommandHour: yup.number().min(0,"Number cannot be less than zero")
    .max(12, "Hour cannot be greater than 12")
    .required("This field is required"),

    gmtCommandMinute:  yup.number().min(0,"Number cannot be less than zero")
    .max(59, "Minute cannot be greater than 59")
    .required("This field is required")
})