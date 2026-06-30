export interface DeviceReportConfig {
    deviceName: string;
    deviceNo: number;
    deviceType: number;
    shiftType: number;
    activeStatus: boolean;
    reportEnable: boolean;
    reportDistMargin: number;
    reportTimeMargin: number;
}

export interface IDivisionReportConfig {
    divisionName: string,
    activeStatus: boolean | null,
    reportEnable: null | unknown,
    devices: DeviceReportConfig[]
}


export interface IDeviceReportConfigResponse {
    code: number;
    data: {
        result: IDivisionReportConfig[];
    };
    success: boolean;
    message: string;
}

export interface DeviceConfigStatus {
    devices: string;
    activeStatus: boolean;
    reportEnable: boolean;
}

export interface ReportDeviceConfigStatus {
    divisionId: string;
    deviceTypeId: number;
    devices: DeviceConfigStatus[];
}

export interface IDeviceReportConfigStatusResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}




export interface DivisionConfigStatusRequest {
    divisionId: string;
    activeStatus: boolean;
    reportEnable: boolean;
}


export interface IDivisionDeviceReportConfigResponse {
    code: number;
    data: {
        result: string;
    };
    success: boolean;
    message: string;
}

