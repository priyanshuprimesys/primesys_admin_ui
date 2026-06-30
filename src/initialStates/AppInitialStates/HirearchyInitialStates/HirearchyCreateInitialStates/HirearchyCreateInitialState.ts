import { IHirearchyCreateInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";






export const HirearchyCreateInitialState:IHirearchyCreateInterface={
    name : "",
    mobile_no : "",
    user_name : "",
	device_list : "",
    dept_id : 0,
    path:"",
	track_division_id : "",
	role : "",
	role_id : 0,
	school_id : 0,
    country_code : null,
	is_railway_user : true,
	report_email_sent : true,
	email_login_password : null,
    po_end_date : "",
	po_no : "",
	short_name:""
}