import { useMutation } from "@tanstack/react-query"
import { IOtpVerifyRequestInterface } from "../interfaces/IOtpVerifyRequestInterface"
import { postVerifyOtp } from "../services/api"
import { otpKeyVerify } from "../services/queryKeys"
import { toast } from "react-toastify"





export const useVerifyOtp = () =>{

    return useMutation({
        mutationKey:[otpKeyVerify],
        mutationFn:(request:IOtpVerifyRequestInterface) =>{
            return postVerifyOtp(request);
        },
        retry:false,
        onSuccess(data){
            if(data.data.success == false){
                toast.error(data.data.data.result);
            }
        },
        onError(){

        }
    })
}