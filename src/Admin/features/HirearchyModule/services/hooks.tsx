import { useQuery } from "@tanstack/react-query"
import { getReportEmailMaster } from "./api";





export const useGetEmailMaster = () => {
    return useQuery({
        queryKey: ['get-email-master-query-key'],
        queryFn: () => getReportEmailMaster(),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: true
    });
}