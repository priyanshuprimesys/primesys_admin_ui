import { IHirearchyTrackUserRequestInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserRequestInterface";








export const HirearchyTrackUserRequestInitialState: IHirearchyTrackUserRequestInterface = {
    mobile_no: "",
    name: "",
    user_name: "",
    report_email_id: "",
    report_email_password: "",
    report_email_sent: false,

    role: "TRACK_USER",
    role_id: 7,
    school_id: 1051,
    device_list: ",",
    track_division_id: "",
    dept_id: 1,
    email_login_password: "Primesys@123",
    path: "",
    country_code: "IN",
    is_railway_user: true,
    po_end_date: "",
    po_no: "",
    last_modified: Math.floor(new Date().getTime() / 1000),
    last_modified_by: "",
    short_name: "",
    whatsapp_group_name: ""
}