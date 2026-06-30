import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface UserDetailInterface extends SuccessInterface{
    data:{
        result:{
            userName:string;
            mobileNo:string;
            emailID:string;
            roleId:number;
            divisionId:string;
            socketUrl:string;
            distUnit:string;
        }
    }
}