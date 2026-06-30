import * as yup from "yup";




export const SoSCommandValidation = yup.object().shape({
    sosNumberOne: yup.string().min(10,'Please enter 10 digits mobile number').required('This field is required')
    .max(13,'Limit exceeds'),

    sosNumberTwo: yup.string().min(10,'Please enter 10 digits mobile number').max(13,'Limit exceeds')
    .required("This field is required"),

    sosAdminNumber: yup.string().min(10,"Please enter 10 digits mobile number").max(13,"This field is required")
    .required("This field is required")
})





