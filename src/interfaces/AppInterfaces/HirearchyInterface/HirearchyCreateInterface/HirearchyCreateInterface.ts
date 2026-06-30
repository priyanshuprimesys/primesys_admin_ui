



export interface IHirearchyCreateInterface{
    name : string,
    mobile_no : string,
    user_name : string,
	device_list : string,
    dept_id : number,
    path:string,
	track_division_id : string,
	role : string,
	role_id : number,
	school_id : number,
    country_code : null,
	is_railway_user : boolean,
	report_email_sent : boolean,
	email_login_password : null,
    po_end_date : string,
	po_no : string;
	short_name:string;
}
export interface IHirearchyFormikCreateInterface{
    name : string,
    mobile_no : string,
    user_name : string,
	device_list : string,
    dept_id : string,
    path:string,
	path_name:string, // This is optional and customised for form
	track_division_id : string,
	role : string,
	role_id : string,
	school_id : number,
    country_code : null,
	is_railway_user : boolean,
	report_email_sent : boolean,
	email_login_password : null,
    po_end_date : string,
	po_no : string;
	short_name:string
}