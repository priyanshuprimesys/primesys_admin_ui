

export enum ProcessType {
    SEND_REPORT_EMAIL = "SEND_REPORT_EMAIL",
    SEND_PARENT_EMAIL = "SEND_PARENT_EMAIL",
}

export enum EmailStatus {
    PENDING = "PENDING",
    GENERATING_REPORT = "GENERATING_REPORT",
    READY = "READY",
    SENDING = "SENDING",
    SENT = "SENT",
    FAILED = "FAILED",
}



export interface ReportEmailQueueLogDTO {
    id: string;
    queueId: string;
    divisionId: string;
    deviceTypeId: number;
    reportDate: number;
    processDivisionId: string;
    processDivisionName: string;
    processType: ProcessType;
    emailSentTo: string;
    status: EmailStatus;
    triggeredBy: string;
    errorMessage: string;
    processingStartedAt: number;
    createdAt: number;
    updatedAt: number;
}



export interface ReportEmail {
    id: string | null;
    divisionId: string | null;
    divisionName: string | null;
    deviceTypeId: number | null;
    reportDate: number | null;
    reportEndTime: number | null;
    reportLockTime: number | null;
    status: "PENDING" | "GENERATING_REPORT" | "READY" | "SENDING" | "SENT" | "FAILED" | string | null;
    processStartedAt: number | null;
    retryCount: number | null;
    errorMessage: string | null;
    triggeredBy: string | null;
    createdAt: number | null;
    updatedAt: number | null;
    reportEmailLogs: ReportEmailQueueLogDTO[];
    sent: boolean | null;
    sentAt: number | null;
}

export interface ReportEmailStatusResponse {
    code: number;
    message: string;
    data: {
        result: ReportEmail[]
    };
    status: boolean;
}



export interface SystemViewResponse {
    code: number;
    data: {
        result: QueueReport[];
    };
    success: boolean;
    message: string;
}

export interface QueueReport {
    queueId: string;
    divisionId: string;
    divisionName: string;
    deviceTypeId: number;
    reportDate: number;

    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;

    sent: boolean;
    sentAt: number | null;

    processingStartedAt: number | null;

    retryCount: number;

    errorMessage: string | null;
    errorAt: number | null;

    triggeredBy: string | null;

    createdAt: number;
    updatedAt: number;

    processLogs: ProcessLog[] | null;
}

export interface ProcessLog {
    message: string;
    timestamp: number;
}