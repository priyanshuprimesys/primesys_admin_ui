import { useMutation } from "@tanstack/react-query"
import { postGenerateOtp } from "../services/queryKeys"
import { postOtpGeneration } from "../services/api"
import { useToast } from "@chakra-ui/react"
import { IOtpRequestInterface } from "../interfaces/IOtpRequestInterface"



export const useGenerateOtp = () =>{

    const toast = useToast();

    return useMutation({
        mutationKey:[postGenerateOtp],
        mutationFn:(userId:IOtpRequestInterface)=>{
            return postOtpGeneration(userId);
        },
        retry:false,
        onSuccess(){
            toast({
                status:'success',
                title:"OTP generated",
                isClosable:true,
                variant:'solid',
                duration:1400
            })
        },
        onError(){
            toast({
                status:'error',
                title:"OTP not generated",
                isClosable:true,
                variant:'solid',
                duration:1400
            })  
        }
    })
}