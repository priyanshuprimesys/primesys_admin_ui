import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchDivisionReportDeviceConfig, updateDeviceReportStatus, updateDivisionDeviceReportStatus } from "./api"
import { DivisionConfigStatusRequest, ReportDeviceConfigStatus } from "./schema"
import { toast } from "react-toastify"


const BASE_KEY = "DEVICE_REPORT_CONFIG"
// const DIVISION_STATUS = "DIVISION_STATUS";




export const useDeviceReportConfig = (divisionId: string, deviceTypeId: number) => {
    return useQuery({
        queryKey: [BASE_KEY, divisionId, deviceTypeId],
        queryFn: () => fetchDivisionReportDeviceConfig(divisionId, deviceTypeId),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!divisionId && deviceTypeId != 0
    })
}


export const useUpdateDeviceReportStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reportId: ReportDeviceConfigStatus) =>
            updateDeviceReportStatus(reportId),
        retry: false,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [BASE_KEY] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete report log");
        }
    });
};

export const useUpdateDivisionDeviceReportStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: DivisionConfigStatusRequest) =>
            updateDivisionDeviceReportStatus(request),
        retry: false,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [BASE_KEY] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete report log");
        }
    });
};

