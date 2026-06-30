import { TokenResponseErrorInterface } from "../../interfaces/AuthInterfaces/TokenResponse/TokenResponseErrorInterface";

export const TokenResponseErrorInitialState:TokenResponseErrorInterface={
    message:'',
    response:{
        data:{
            access_token:'',
            refresh_token:''
        },
        status:403
    }
}