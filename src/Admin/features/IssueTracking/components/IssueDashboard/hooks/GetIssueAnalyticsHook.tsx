import { useQuery } from "@tanstack/react-query"
import { getIssueDashboardAnalytics } from "../services/api"
import { IAnalyticsRequest } from "../interfaces/IAnalyticsRequest"






export const GetIssueAnalyticsHook = (request:IAnalyticsRequest) =>{
    return useQuery({
        queryKey:["issue-analytics-dashboard-key"],
        queryFn:() => getIssueDashboardAnalytics(request),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus: true,
        enabled: !!request.assigneeId
    });
}