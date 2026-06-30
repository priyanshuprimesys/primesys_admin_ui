import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";


export interface IEmailMaster {
    id: string,
    email: string,
    password: string,
    active_status: boolean,
    login_password: string,
    mobile_no: unknown,
    divisionsCount: number,
    divisions: string[]
}


export interface IEmailMasterResponse extends SuccessInterface {
    data: {
        result: IEmailMaster[]
    }
}