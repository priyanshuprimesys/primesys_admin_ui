import { ILoginTrackUserInterface } from "../../../interfaces/AppInterfaces/IDivision_Login_Track_Users_Detail_Interface/ILoginTrackUserInterface";






export const LoginDivisionTrackUserInitialState:ILoginTrackUserInterface = {
    id: '',
    role: '',
    enabled: false,
    accountNonExpired: false,
    accountNonLocked: false,
    credentialsNonExpired: false,
    username: '',
    authorities: [],
    parent_id: 0,
    user_login_id: 0,
    school_id: 0,
    user_name: '',
    name: '',
    password: '',
    mobile_no: '',
    role_id: 0,
    dept_id: 0,
    county_code: null,
    is_railway_user: false,
    path: '',
    device_list: '',
    county: null,
    report_email_id: null,
    report_email_password: null,
    po_no: '',
    po_end_date: '',
    track_division_id: '',
    created_at: null,
    last_modified: null,
    report_email_sent: false,
    email_login_password: null,
    modules_list: []
}