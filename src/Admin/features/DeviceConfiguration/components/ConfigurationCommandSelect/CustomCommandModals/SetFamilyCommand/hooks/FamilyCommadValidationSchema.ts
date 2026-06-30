import * as yup from "yup";







export const familyCommandSchema =  yup.object().shape({
    familyNumberOne: yup.string().min(10,"Please enter 10 digits mobile number").max(13,"Mobile number exceeds")
    .required("This field is required"),

    familyNumberTwo: yup.string().min(10,"Please enter 10 digits mobile number").max(13,"Mobile number exceeds")
    .required("This field is required"),

    familyNumberThree: yup.string().required("This field is required").min(10,"Please enter 10 digits mobile number")
    .max(13,"Mobile number exceeds")
});