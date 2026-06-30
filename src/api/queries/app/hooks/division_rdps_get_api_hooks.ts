import { useQuery } from "@tanstack/react-query"
import { division_rdps_get_query } from "../queryKeys/queryKeys"
import { getDivisionRdpsData } from "../features/division_rdps_upload/division-rdps-get-api"







export const useGetDivisionRdpsQuery = (divisionId:string) =>{
    return useQuery({
        queryKey:[division_rdps_get_query],
        queryFn:()=> getDivisionRdpsData(divisionId),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:!!divisionId
    })
}