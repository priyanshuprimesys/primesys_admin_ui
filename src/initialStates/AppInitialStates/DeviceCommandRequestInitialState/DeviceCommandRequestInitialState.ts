import { IDeviceCommandRequestBulkInterface } from "../../../interfaces/AppInterfaces/DeviceCommandRequestInterface/DeviceCommandRequestBulkInterface";






export const DeviceCommandRequestInitialState:IDeviceCommandRequestBulkInterface =[
    {
        device_imei:0,
        command:'',
        device_name:'',
        login_name:'',
        division_id:''
    }
]