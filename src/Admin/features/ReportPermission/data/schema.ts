import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"



export interface IReportPermissionPatchRequest {
    divisionId: string,
    modulesList: string[],
    modifiedBy: string
}


export interface IReportPermissionSubModule {
    id: unknown,
    moduleName: string,
    displayName: string,
    displayOrder: number,
    subModules: unknown,
    typeId: number
}

export interface IReportPermissionModule {
    id: string,
    moduleName: string,
    displayName: string,
    displayOrder: number,
    active?: boolean;
    subModules: IReportPermissionSubModule[]
}


interface Authority {
    authority: string;
}

export interface RailSubUser {
    id: string;
    role: string;
    reportEnable: boolean | null;
    enabled: boolean;
    username: string;

    authorities: Authority[];

    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;

    parent_id: string | null;
    user_login_id: number | null;
    school_id: number;

    user_name: string;
    name: string;
    password: string;
    mobile_no: string;

    role_id: number;
    dept_id: number;
    county_code: string | null;
    is_railway_user: boolean;

    path: string;
    device_list: string;
    county: string | null;

    report_email_id: string | null;
    report_email_password: string | null;

    po_no: string;
    po_end_date: string;

    track_division_id: string;

    created_at: string | null;
    last_modified: string | null;
    last_modified_by: string | null;

    short_name: string;
    report_email_sent: boolean;

    email_login_password: string | null;

    modules_list: string[];

    active_status: boolean;

    whatsapp_group_name: string | null;

    fcm_token_list: string[] | null;
    fcm_updated_at: number;
}



export interface IDivisionAllInterface extends SuccessInterface {
    data: {
        result: RailSubUser[]
    }
}


export interface IReportPermissionModuleResponse extends SuccessInterface {
    data: IReportPermissionModule[]
}



export interface IAllDivisionListType {
    id: string,
    userName: string,
    name: string,
    deptId: number,
    trackDivisionId: string
}



export interface IAllDivisionListResponse {
    data: {
        result: IAllDivisionListType[]
    },
    code: number,
    status: string,
    message: string
}



export interface IReportPermission {
    id: string,
    userName: string,
    name: string,
    deptId: number,
    trackDivisionId: string,
    moduleList: [string]
}

export interface IReportPermissionResponse {
    success: boolean,
    message: string,
    code: number,
    data: {
        result: IReportPermission
    }
}