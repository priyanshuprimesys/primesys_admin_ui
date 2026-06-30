import * as yup from "yup";



export const beatSingleUploadValidation = yup.object().shape({
    deviceName: yup.string().optional(),
    deviceNo: yup.number().required("Device number is required"),
    sectionName: yup.string().required("Section name is required"),
    beatId: yup.string().optional(),
    startTime: yup.string().required().required("StartTime is required"),
    endTime: yup.string().required().required("EndTime is required"),
    bstartTime: yup.string().required().required("Break start is required"),
    bendTime: yup.string().required().required("Break end is required"),
    tstartKm:yup.number().required("Trip start km is required"),
    tendKm: yup.number().required("Trip end km is required"),
    deviceTypeId: yup.string().required("Device Type is required"),
    tripNo:yup.number().required("Trip No is required")
})