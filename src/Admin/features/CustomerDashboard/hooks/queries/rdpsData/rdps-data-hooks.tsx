import { useQuery } from "@tanstack/react-query"
import { customer_rdps_query } from "../../../queryKey/queryKey";
import { getRdpsDataQuery } from "../../../services/apis/rdpsData/rdps-division-api";
import { RdpsRequestInterface } from "../../../interfaces/RdpsInterface/RdpsRequestInterface";




export const useRdpsData = (request: RdpsRequestInterface) =>{
    return useQuery({
        queryKey:[customer_rdps_query],
        queryFn:() => getRdpsDataQuery(request),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: request.divisionId !== ''&& request.lat !==0 && request.lan !==0
    });
}