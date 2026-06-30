import * as yup from "yup";








export const ManualCommandValidation = yup.object().shape({
    manualCommand: yup.string().required("This field cannot be empty")
})