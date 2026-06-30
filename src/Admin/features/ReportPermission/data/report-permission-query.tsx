import { queryOptions, useQuery } from "@tanstack/react-query"
import { getAllDivisionDetail, getAllDivisionList, getAllReportModules, getReportPermissionById } from "./api"


const BASE_KEY = "division_list_key";
export const PERMISSION_BY_ID = "permission-query-by-id";


export const useGetReportModules = () => {
    return useQuery({
        queryKey: ['get-all-report-modules'],
        queryFn: getAllReportModules,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: true
    })
}


export const useGetAllDivisions = () => {
    return useQuery({
        queryKey: ['get-all-division-query'],
        queryFn: getAllDivisionDetail,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: true
    })
}



export const fetchDivisionListQuery = () => {
    return queryOptions({
        queryKey: [BASE_KEY],
        queryFn: () => getAllDivisionList(),
        retry: 1,
        staleTime: 8640000
    })
}




export const useGetReportPermission = (id: string) => {
    return useQuery({
        queryKey: [PERMISSION_BY_ID, id],
        queryFn: () => getReportPermissionById(id),
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!id
    })
}