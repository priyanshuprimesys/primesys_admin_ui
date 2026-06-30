import { IDeviceCommandInterface } from "../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandInterface";





export const DeviceCommandInitialState:IDeviceCommandInterface ={
    id: 0,
    title: '',
    command: '',
    reply: '',
    description: '',
    activeStatus: false,
    custom: false
}