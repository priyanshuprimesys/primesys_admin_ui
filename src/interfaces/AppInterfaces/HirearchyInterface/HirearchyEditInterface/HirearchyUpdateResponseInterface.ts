import { IDivisionParentIdAuthorityInterface } from "../../DivisionInterface/DivisionParentIdInterface/DivisionParentIdAuthorityInterface";
import { SuccessInterface } from "../../SuccessResponseInterface/SuccessInterface";









export interface IHirearchyUpdateResponseInterface extends SuccessInterface {
    data: {
        result: {
            id: string,
            role: string,
            enabled: boolean,
            username: string,
            accountNonExpired: boolean,
            accountNonLocked: boolean,
            credentialsNonExpired: boolean,
            authorities: [IDivisionParentIdAuthorityInterface],
            parent_id: any,
            user_login_id: any,
            school_id: number,
            user_name: string,
            name: string,
            password: string,
            mobile_no: string,
            role_id: number,
            dept_id: number,
            county_code: any,
            is_railway_user: boolean,
            path: string,
            device_list: string,
            county: any,
            report_email_id: any,
            report_email_password: any,
            po_no: string,
            po_end_date: string,
            track_division_id: string,
            created_at: any,
            last_modified: number,
            last_modified_by: string,
            report_email_sent: boolean,
            email_login_password: boolean,
            active_status:boolean,
            whatsapp_group_name:string
        }
    }
}