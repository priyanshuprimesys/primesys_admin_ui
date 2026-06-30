export interface ReportSubModule {
    id: string | null;
    moduleName: string;
    displayName: string;
    displayOrder: number;
    subModules: ReportSubModule[] | null;
    typeId: number;
}

export interface ReportModule {
    id: string;
    moduleName: string;
    displayName: string;
    status: boolean;
    subModules?: ReportSubModule[];
}

export interface ReportModuleResponse {
    code: number;
    data: {
        result: ReportModule[];
    };
    success: boolean;
    message: string;
}

export interface UpdateReportModulePayload {
    divisionId: string;
    moduleList: string[];
}

export interface UpdateReportModuleResponse {
    success: boolean;
    message: string;
    data: {
        result: string;
    };
}
