import { useQuery } from "@tanstack/react-query"
import { IDashboardRequestInterface } from "../interfaces/DashboardAnalytics"
import { getDashboardAnalytics } from "../services/api"






export const GetDashboardAnalytics = (request:IDashboardRequestInterface) =>{
    return useQuery({
        queryKey:["get-dashboard-analytics-all"],
        queryFn:()=> getDashboardAnalytics(request),
        retry:false,
        refetchInterval:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: !!request.assigneeId
    })
}