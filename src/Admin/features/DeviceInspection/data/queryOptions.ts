import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllDeviceInspectionReportService, postDeviceInspectionReportService, putDeviceInspectionReportService } from "./api";
import { IDeviceInspectionReport } from "./schema";








export const useGetAllDeviceInspectionReport = () => {
    return useQuery({
        queryKey: ['get-all-device-inspection-query-key'],
        queryFn: getAllDeviceInspectionReportService,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: true
    });
};


export const usePostDeviceInspectionMutation = () => {
    return useMutation({
        mutationKey: ['post-device-inspection-key'],
        mutationFn: (request:IDeviceInspectionReport) =>{
            return postDeviceInspectionReportService(request);
        }
    });
}


export const usePutDeviceInspectionMutation = () => {
    return useMutation({
        mutationKey: ['post-device-inspection-key'],
        mutationFn: (request:IDeviceInspectionReport) =>{
            return putDeviceInspectionReportService(request);
        }
    });
}