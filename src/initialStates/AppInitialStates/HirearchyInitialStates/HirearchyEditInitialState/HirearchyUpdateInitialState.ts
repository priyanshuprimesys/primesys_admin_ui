import { IHirearchyUpdateInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateInterface";







export const HirearchyUpdateInitialState: IHirearchyUpdateInterface = {
	"id": "",
	"school_id": 0,
	"user_name": "",
	"name": "",
	"mobile_no": "",
	"role_id": 0,
	"dept_id": 0,
	"is_railway_user": false,
	"path": "",
	"device_list": "",
	"po_no": "",
	"po_end_date": "",
	"track_division_id": "",
	"role": "",
	"report_email_sent": false,
	"last_modified_by": "",
	"last_modified": new Date().getTime() / 1000,
	"short_name": "",
	active_status: false,
	whatsapp_group_name: "",
	report_email_id: "",
	report_email_password: "",
	email_login_password: ""
}