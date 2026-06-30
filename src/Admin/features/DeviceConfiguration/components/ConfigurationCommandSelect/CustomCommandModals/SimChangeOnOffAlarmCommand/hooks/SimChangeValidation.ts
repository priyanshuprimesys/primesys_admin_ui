import * as yup from "yup";






export const SimChangeValidation = yup.object().shape({
    simChange: yup.boolean().required(""),
    simChangeBool: yup.string().required("")
})