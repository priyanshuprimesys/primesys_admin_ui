export interface IBulkLocationChangeRequest {
    imeiList: number[];
    lat: number;
    lon: number;
    divisionId: string;
}

export interface ILocationTransferRequest {
    imeiNos: number[];
    divisionId: string;
    usedId: string;
    fromStartTime: number;
    fromEndTime: number;
    toStartTime: number;
    toEndTime: number;
}

export interface IBulkLocationChangeResponse {
    data: {
        result: string;
    };
    code: number;
    success: boolean;
    message: string;
}
