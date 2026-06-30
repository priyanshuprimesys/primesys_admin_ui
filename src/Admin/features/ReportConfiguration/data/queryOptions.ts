import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteReportLog, fetchRegenerateReportLog, fetchReportConfig, fetchReportConfigDetails, fetchReportLog, updateReportLogStatus } from "./api";
import { toast } from "react-toastify";
import { RegenerateReportRequest } from "./schema";

const BASE_KEY = "report-config";
export const REPORT_DIVISION_LOG = "report-division-log";




export const useFetchReportConfig = (divisionId: string) => {

    return useQuery({
        queryKey: [BASE_KEY, divisionId],
        queryFn: () => fetchReportConfig(divisionId),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!divisionId
    })
}


export const useFetchReportConfigDetails = (divisionId: string, enabled: boolean) => {
    return useQuery({
        queryKey: [BASE_KEY, divisionId],
        queryFn: () => fetchReportConfigDetails(divisionId),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!divisionId && enabled
    })
}


export const useFetchReportDivisionLog = (divisionId: string, deviceTypeId: number, reportDate: number) => {
    return useQuery({
        queryKey: [REPORT_DIVISION_LOG, divisionId, deviceTypeId, reportDate],
        queryFn: () => fetchReportLog(divisionId, deviceTypeId, reportDate),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!divisionId && !!deviceTypeId && !!reportDate
    })
}

export const useDeleteReportLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reportId: { reportId: string }) =>
            deleteReportLog(reportId.reportId),
        retry: false,
        onSuccess: () => {
            toast.success("Report log deleted successfully");
            queryClient.invalidateQueries({ queryKey: [REPORT_DIVISION_LOG] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete report log");
        }
    });
};



export const updateStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: ({
            reportId,
            divisionId,
            deviceTypeId,
            reportDate,
            status,
        }: {
            reportId: string;
            divisionId: string;
            deviceTypeId: number;
            reportDate: number;
            status: string;
        }) =>
            updateReportLogStatus(
                reportId,
                divisionId,
                deviceTypeId,
                reportDate,
                status
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [REPORT_DIVISION_LOG],
            });

            toast.success("Report status updated");
        },
    });
}





export const useReportRegenerateLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: RegenerateReportRequest) =>
            fetchRegenerateReportLog(request),
        retry: false,
        onSuccess: () => {
            toast.success("Report log regenerated successfully");
            queryClient.invalidateQueries({ queryKey: [REPORT_DIVISION_LOG] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to regenerate report log");
        }
    });
};
