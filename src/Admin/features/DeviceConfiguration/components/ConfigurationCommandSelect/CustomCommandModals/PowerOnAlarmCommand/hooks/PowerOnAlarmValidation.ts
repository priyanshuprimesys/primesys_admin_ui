import * as yup from "yup";




export const PowerOnAlarmValidation = yup.object().shape({
    powerOnAlarm: yup.string().required("This field is required"),
    powerOnAlarmBool: yup.string().required("This field is required")
})