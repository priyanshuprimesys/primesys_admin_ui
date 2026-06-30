import { useQuery } from "@tanstack/react-query"
import { getAllReportEmailStatus, getEmailSystemView } from "./api"




export const useGetAllReportEmailStatusQuery = (reportDate: number) => {
    return useQuery({
        queryKey: ["report-email-status-query", reportDate],
        queryFn: () => getAllReportEmailStatus(reportDate),
        enabled: true,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    })
}

export const useGetEmailSystemViewQuery = (reportDate: number) => {
    return useQuery({
        queryKey: ["email-system-view-query", reportDate],
        queryFn: () => getEmailSystemView(reportDate),
        enabled: true,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    })
}