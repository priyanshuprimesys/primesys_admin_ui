export interface ReportEmailLog {
    emailSent?: boolean;
    emailSentTo?: string;
    description?: string;
    emailSentAt?: number;
}

export interface ReportEmailResponse {
    divisionId?: string;
    trackDivisionId?: string;
    divisionName: string;
    reportEmailLog?: ReportEmailLog;
}


export interface ReportEmailConfigResponse {
    code: number;
    data: {
        result: ReportEmailResponse[];
    };
    success: boolean;
    message: string;
}



export interface ReportEmailRequest {
    divisionId: string;
    deviceTypeId: number;
    reportDate: number;
    userId: string
}


export interface ReportEmailDivisionSendingResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}
