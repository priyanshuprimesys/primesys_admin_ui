import { useQuery } from "@tanstack/react-query"
import { deviceDetail } from "../queryKeys/queryKeys"
import { getStudentDeviceDetails } from "../features/getStudentDeviceDetails/getStudentDeviceDetails"





export const useGetDeviceDetailsQuery = (divisionId:string) =>{

 

    return useQuery({
        queryKey:[deviceDetail,divisionId],
        queryFn:()=> getStudentDeviceDetails(divisionId),
        refetchOnMount:false,
        retry:false,
        refetchOnWindowFocus:false,
        enabled:!!divisionId,
    })
}