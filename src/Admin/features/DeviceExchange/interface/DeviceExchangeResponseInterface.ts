import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"

export interface IDeviceExchangeInterface {
    id: string,
    oldDeviceIMEI: number,
    oldDeviceName: string,
    oldDeviceSimNo: string,
    oldDeviceSimIMEINo: string,
    oldDeviceNo: number,
    oldDeviceTypeId: number,
    divisionId: string,
    exchangeBy: string,
    exchangeAt: number,
    newDeviceIMEI: number,
    newDeviceName: string,
    newDeviceSimNo: string,
    newDeviceSimIMEINo: string,
    newDeviceNo: number,
    newDeviceTypeId: number
}


export const DeviceExchangeIntitialState: IDeviceExchangeInterface = {
    id: "",
    oldDeviceIMEI: 0,
    oldDeviceName: "",
    oldDeviceSimNo: "",
    oldDeviceSimIMEINo: "",
    oldDeviceNo: 0,
    oldDeviceTypeId: 0,
    divisionId: "",
    exchangeBy: "",
    exchangeAt: 0,
    newDeviceIMEI: 0,
    newDeviceName: "",
    newDeviceSimNo: "",
    newDeviceSimIMEINo: "",
    newDeviceNo: 0,
    newDeviceTypeId: 0
}


export interface IDeviceExchangeDetailsInterface extends SuccessInterface {
    data: {
        result: {
            content: [IDeviceExchangeInterface],
            pageable: {
                sort: {
                    empty: boolean,
                    sorted: boolean,
                    unsorted: boolean
                },
                offset: number,
                pageNumber: number,
                pageSize: number,
                paged: boolean,
                unpaged: boolean
            },
            last: boolean,
            totalElements: number,
            totalPages: number,
            size: number,
            number: number,
            sort: {
                empty: boolean,
                sorted: boolean,
                unsorted: boolean
            },
            first: boolean,
            numberOfElements: number,
            empty: boolean
        }
    }
}