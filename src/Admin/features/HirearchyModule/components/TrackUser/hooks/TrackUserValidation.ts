import * as yup from "yup";

export const RequiredField:string = "This field is required";


export const TrackUserValidation = yup.object().shape({
    mobile_no: yup.string().required(RequiredField),

    name: yup.string().required(RequiredField),

    user_name: yup.string().required(RequiredField),

    report_email_id: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format").required(RequiredField),

    report_email_password: yup.string().required(RequiredField),

    report_email_sent: yup.boolean().required("")
})