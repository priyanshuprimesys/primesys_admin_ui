import * as yup from "yup";








export const HBTValidation = yup.object().shape({
    hbtTime: yup.number().min(0,"Number cannot be less than zero")
    .max(300,"Number cannot be greater than 300")
    .required("This field is required")
})