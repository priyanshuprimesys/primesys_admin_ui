import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"

export interface IDataPacketInterface {
    id: string,
    deviceImei: number,
    packet: string,
    timestamp: number,
    packetFrom: string,
    packetType: string
}


export interface IDataPageable {
    sort: {
        empty: boolean,
        unsorted: boolean,
        sorted: boolean
    },
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    unpaged: boolean
}



export interface IDataPacketResultContent {
    result: {
        content: IDataPacketInterface[],
        pageable: IDataPageable,
        totalPages: number,
        totalElements: number,
        last: boolean,
        size: number,
        number: number,
        sort: {
            empty: boolean,
            unsorted: boolean,
            sorted: boolean
        },
        numberOfElements: number,
        first: boolean,
        empty: boolean
    }
}

export interface IDataPacketResponse extends SuccessInterface {
    data: IDataPacketResultContent
}