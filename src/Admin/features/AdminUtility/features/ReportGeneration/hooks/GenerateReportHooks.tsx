import { useMutation } from "@tanstack/react-query"
import { postGenerateReportQueryKey } from "../services/queryKeys"
import { postReportGeneration } from "../services/api"
import { IReportGenerateRequestInterface } from "../interfaces/IReportGenerateRequest"
import { useToast } from "@chakra-ui/react"


export const usePostGenerateReport = () =>{

    const toast = useToast();

    return useMutation({
        mutationKey:[postGenerateReportQueryKey],
        mutationFn:(request:IReportGenerateRequestInterface)=>{
            return postReportGeneration(request);
        },
        retry:false,
        onSuccess(){
        },
        onError(){
            toast({
                status:'error',
                title:'Report Generation Error',
                description:"Please wait someone is generating report",
                isClosable:true,
                duration:1700,
                variant:'subtle'
            })
        }

    })
}