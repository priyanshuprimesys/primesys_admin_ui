
export interface AuthorityInterface{
    authority:string;
}


export interface TrackUser{
    id:string;
    role:string;
    enabled:boolean;
    accountNonExpired:boolean;
    accountNonLocked:boolean;
    credentialsNonExpired:boolean;
    username:string;
    authorities:AuthorityInterface[];
    parent_id:number;
    user_login_id:number;
    school_id:number;
    user_name:string;
    name:string;
    password:string;
    mobile_no:string;
    role_id:number;
    dept_id:number;
    county_code:null;
    is_railway_user:boolean;
    path:string;
    device_list:string;
    county:null;
    report_email_id:null;
    report_email_password:null;
    po_no:string;
    po_end_date:string;
    track_division_id:string;
    created_at:null;
    last_modified:null;
    report_email_sent:boolean;
    email_login_password:null
}


