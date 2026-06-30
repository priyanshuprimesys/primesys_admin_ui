import { useQuery } from "@tanstack/react-query"
import { division_parent_key } from "../queryKeys/queryKeys"
import getDivisionParentId from "../features/division_parent_id/division_parent_id_api"






export const useGetDivisionParentId = (divisionId:string) =>{
    return useQuery({
        queryKey:[division_parent_key],
        queryFn:()=>getDivisionParentId(divisionId),
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        retry:false,
        enabled:!!divisionId,
    });
}