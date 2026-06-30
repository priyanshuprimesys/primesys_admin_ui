import { TokenResponseInterface } from "./TokenResponseInterface";

export interface TokenResponseErrorInterface{
    message:string;
    response:{
        data:TokenResponseInterface,
        status:number
    }
}