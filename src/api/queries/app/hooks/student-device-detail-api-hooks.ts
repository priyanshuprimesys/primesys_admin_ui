import { useQuery } from "@tanstack/react-query"
import { student_device_detail_query_key } from "../queryKeys/queryKeys"
import { getStudentDeviceDetails } from "../features/getStudentDeviceDetails/getStudentDeviceDetails";







const useGetStudentDeviceDetailQuery = (divisionId:string) =>{
    return useQuery({
        queryKey:[student_device_detail_query_key,divisionId],
        queryFn:()=> getStudentDeviceDetails(divisionId),
        refetchOnMount:false,
        retry:false,
        refetchOnWindowFocus:false,
        enabled:!!divisionId
    })
};



export {useGetStudentDeviceDetailQuery};