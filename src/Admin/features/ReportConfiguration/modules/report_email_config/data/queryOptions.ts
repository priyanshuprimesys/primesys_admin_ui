import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchReportLog, sendReportEmail } from "./api";


const REPORT_EMAIL_LOG = "REPORT_EMAIL_LOG";




export const useFetchReportEmailLog = (divisionId: string, deviceTypeId: number, reportDate: number) => {
    return useQuery({
        queryKey: [REPORT_EMAIL_LOG, divisionId, deviceTypeId, reportDate],
        queryFn: () => fetchReportLog(divisionId, deviceTypeId, reportDate),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!divisionId && !!deviceTypeId && !!reportDate
    })
}

export const useSendReportEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["SEND_REPORT_EMAIL"],
        mutationFn: (request: { divisionId: string; deviceTypeId: number; reportDate: number, userId: string }) => sendReportEmail(request),
        onSuccess: () => {
            toast.success("Report email sent successfully");
            queryClient.invalidateQueries({ queryKey: [REPORT_EMAIL_LOG] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to send email");
        },
    });
};
