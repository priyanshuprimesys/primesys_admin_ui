import * as yup from "yup";









export const SOSOnOffValidation = yup.object().shape({
    sosOnOffAlarm: yup.string().required(""),
    sosNumber:yup.number().required("This field is required").min(1,"Number cannot be smaller than 1")
    .max(3,"Number cannot be greater than 3")
})