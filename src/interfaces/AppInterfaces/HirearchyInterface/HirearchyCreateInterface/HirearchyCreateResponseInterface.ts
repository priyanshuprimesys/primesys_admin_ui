import { IDivisionParentIdAuthorityInterface } from "../../DivisionInterface/DivisionParentIdInterface/DivisionParentIdAuthorityInterface";



export interface IHirearchyCreateResponseInterface {
    id: string,
    role: string,
    enabled: boolean,
    accountNonExpired: boolean,
    accountNonLocked: boolean,
    credentialsNonExpired: boolean,
    username: string,
    authorities: [IDivisionParentIdAuthorityInterface],
    parent_id: null | number | string,
    user_login_id: null | any,
    school_id: number,
    user_name: string,
    name: string,
    password: string,
    mobile_no: string,
    role_id: number,
    dept_id: number,
    county_code: null | any,
    is_railway_user: boolean,
    path: string,
    device_list: string,
    county: null | any,
    report_email_id: null | any,
    report_email_password: null | any,
    po_no: string,
    po_end_date: string,
    track_division_id: string,
    created_at: null | any,
    last_modified: null | any,
    report_email_sent: boolean,
    email_login_password: string
}



