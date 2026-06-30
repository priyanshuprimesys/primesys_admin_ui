import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface"

export interface IDeviceType {
    id: string,
    deviceType: string,
    deviceTypeId: number,
    deviceNameStartWith: string
}


export interface IDeviceTypeResponse extends SuccessInterface {
    data: {
        result: IDeviceType[]
    }
}
