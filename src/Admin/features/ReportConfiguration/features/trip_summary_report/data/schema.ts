

export interface TripReportSummaryRequest {
    divisionId: string;
    deviceType: number;
    startDateTime: number;
    endDateTime: number;
}

export interface TripStatusSummary {
    deviceName?: string;
    deviceNo?: number;
    deviceImei?: number;
    deviceType?: number;
    reportOfDay?: number;

    deviceOff?: boolean;
    tripCompleted?: boolean;
    tripNotCompleted?: boolean;
    overSpeed?: boolean;
    delayedStart?: boolean;
    inActiveDevice?: boolean;
}

export interface TripStatusSummaryResponse {
    code: number;
    data: {
        result: TripStatusSummary[];
    };
    success: boolean;
    message: string;
}


export interface TripReportDayStatus {
    reportDay: number;
    deviceOff?: boolean;
    tripCompleted?: boolean;
    tripNotCompleted?: boolean;
    overSpeed?: boolean;
    delayedStart?: boolean;
    inActiveDevice?: boolean;
}


export interface TripSummaryDevices {
    deviceName: string;
    deviceNo: number;
    status: TripReportDayStatus[]
}


export interface TripSummaryRegenerateRequest {
    divisionId: string;
    deviceType: number;
    reportDate: number;
}

export interface TripSummaryRegenerateResponse {
    code: number;
    data: {
        result: any;
    };
    success: boolean;
    message: string;
}