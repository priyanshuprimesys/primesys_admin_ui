import * as yup from "yup";



export const LoginValidationSchema = yup.object({
    email: yup.string().email("Invalid usename").required("Username is required"),
    password: yup.string().required("Password is required")
});