import { IDivisionParentIdAuthorityInterface } from "./DivisionParentIdAuthorityInterface";




export interface IDivisionParentIdInterface {
    id: string,
    role: string,
    enabled: boolean,
    username: string,
    authorities: [IDivisionParentIdAuthorityInterface],
    accountNonExpired: boolean,
    accountNonLocked: boolean,
    credentialsNonExpired: boolean,
    parent_id: number,
    user_login_id: number,
    school_id: number,
    user_name: string,
    name: string,
    password: string,
    mobile_no: string,
    role_id: number,
    dept_id: number,
    county_code: null,
    is_railway_user: boolean,
    path: string,
    device_list: string,
    county: null,
    report_email_id: string,
    report_email_password: string,
    po_no: string,
    po_end_date: string,
    track_division_id: string,
    created_at: null,
    last_modified: null,
    report_email_sent: boolean,
    email_login_password: string,
    short_name: string,
    active_status: boolean,
    whatsapp_group_name: string,
    level?: number,
    level_name?: string,
    device_imeis?: string[]
}