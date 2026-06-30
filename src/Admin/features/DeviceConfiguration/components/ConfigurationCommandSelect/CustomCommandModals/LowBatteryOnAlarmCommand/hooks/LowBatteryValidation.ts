import * as yup from "yup";




export const LowBatteryValidation = yup.object().shape({
    lowBatteryOnOff: yup.string().required(""),
    lowBatteryNumber: yup.string().required("")
})