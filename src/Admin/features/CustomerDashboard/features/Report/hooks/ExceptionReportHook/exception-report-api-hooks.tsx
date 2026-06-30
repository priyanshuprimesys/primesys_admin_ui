import { useQuery } from "@tanstack/react-query"
import { exception_report_get_query_key } from "../../queryKeys/reportQueryKey"
import { getExceptionReport } from "../../services/api"
import { IExceptionReportRequest } from "../../interfaces/ExceptionInterface/ExceptionReportRequest"






export const useGetExceptionReport = (exceptionRequest:IExceptionReportRequest) =>{
    return useQuery({
        queryKey:[exception_report_get_query_key],
        queryFn:()=> getExceptionReport(exceptionRequest),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: !!exceptionRequest.startDateTime && !!exceptionRequest.divisionId && !!exceptionRequest.deviceType
    })
}