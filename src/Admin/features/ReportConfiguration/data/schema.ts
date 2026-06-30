export interface ReportConfigSummaryResponse {
    code: number;
    data: ReportConfigSummaryData;
    success: boolean;
    message: string;
}

export interface ReportConfigSummaryData {
    result: ReportConfigSummaryResult;
}

export interface ReportConfigSummaryResult {
    totalDevices: number;
    activeDevices: number;
    inActiveDevices: number;
    reportDisabledDevices: number;
    reportActiveDevices: number;
    reportConfigDetail: ReportConfigDetail[];
}

export interface ReportConfigDetail {
    name: string;
    divisionId: string;
    userName: string;
    totalDevices: number;
    totalReportModule: number;
    activeDevices: number;
    reportEnabled: number;
    inActiveDevices: number;
    reportDisabled: number;
}

export interface ReportConfigDetailResponse {
    code: number;
    data: {
        result: ReportConfigDetailConfig;
    };
    success: boolean;
    message: string;
}

export interface ReportConfigDetailConfig {
    name: string;
    reportEmailId: string;
    reportEmailPassword: string;
    reportEnable: boolean | null;
}

export interface ReportModule {
    moduleName: string;
    displayName: string;
    status: boolean;
    subModules?: ReportSubModule[];
}

export interface ReportSubModule {
    id: number | null;
    moduleName: string;
    displayName: string;
    displayOrder: number;
    subModules: ReportSubModule[] | null;
    typeId: number;
}


export type ReportTabType =
    | "DASHBOARD"
    | "REPORT_LOG"
    | "REPORT_MODULE"
    | "DEVICE_CONFIG"
    | "TRIP_CONFIG"
    | "SUMMARY_REPORT"
    ;




export interface DeleteReportResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}


export interface StatusUpdateReportResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}

export interface CommonReportResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}



export interface RegenerateReportRequest {
    divisionId: string;
    deviceTypeId: number;
    reportDate: number;
}