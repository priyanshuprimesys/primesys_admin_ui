import { IDivisionParentIdInterface } from "../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface";
import { DivisionParentIdAuthorityInitialState } from "./DivisionParentIdAuthorityInitialState";




export const DivisionParentIdInitialState: IDivisionParentIdInterface = {
    id: "",
    role: "",
    enabled: false,
    username: "",
    authorities: [DivisionParentIdAuthorityInitialState],
    accountNonExpired: false,
    accountNonLocked: false,
    credentialsNonExpired: false,
    parent_id: 0,
    user_login_id: 0,
    school_id: 0,
    user_name: "",
    name: "",
    password: "",
    mobile_no: "",
    role_id: 0,
    dept_id: 0,
    county_code: null,
    is_railway_user: false,
    path: "",
    device_list: "",
    county: null,
    report_email_id: "",
    report_email_password: "",
    po_no: "",
    po_end_date: "",
    track_division_id: "",
    created_at: null,
    last_modified: null,
    report_email_sent: false,
    email_login_password: "",
    short_name: "",
    active_status: false,
    whatsapp_group_name: ""
}