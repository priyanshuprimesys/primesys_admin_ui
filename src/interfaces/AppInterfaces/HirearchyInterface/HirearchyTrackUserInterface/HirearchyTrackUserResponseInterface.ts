import { IDivisionParentIdAuthorityInterface } from "../../DivisionInterface/DivisionParentIdInterface/DivisionParentIdAuthorityInterface"
import { SuccessInterface } from "../../SuccessResponseInterface/SuccessInterface"


export interface IHirearchyTrackUserResponseInterface extends SuccessInterface{
    data:{
        result:{
            id: string,
            role: string,
            enabled: boolean,
            username: string,
            authorities: [IDivisionParentIdAuthorityInterface],
            accountNonExpired: boolean,
            accountNonLocked: boolean,
            credentialsNonExpired: boolean,
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
            report_email_id: string,
            report_email_password: string,
            po_no: string,
            po_end_date: string,
            track_division_id: string,
            created_at: any,
            last_modified: any,
            last_modified_by: any,
            report_email_sent: boolean,
            email_login_password: string,
            short_name:string
        }
    }
}