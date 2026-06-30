import * as yup from "yup";


export const AddHirearchyValidation = yup.object().shape({
    name:yup.string().required("Name is required"),
    mobile_no: yup.string().required("Mobile number is required"),
    user_name: yup.string().email('Invalid email format').required("Email is required"),
    dept_id: yup.string().required("Designation is required"),
    path_name: yup.string().required("Parent is required")
})
