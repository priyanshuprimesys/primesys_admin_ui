import { IStudentDeviceDetailsInterface } from "../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceDetailsInterface";






export const DeviceDetailsInitialState:IStudentDeviceDetailsInterface={
    data: {
        result: [{
            deviceId: '',
            validDay: 0,
            name: '',
            imeiNo: 0,
            showGoogleAddress: false,
            simNo: '',
            studentId: 0,
            deviceTypeId: 0,
            deviceUsertype: '',
            deviceNo: 0,
            isDeviceConnected: false
        }]
    },
    success: false,
    error: {
        code: 0,
        message: ""
    }
}