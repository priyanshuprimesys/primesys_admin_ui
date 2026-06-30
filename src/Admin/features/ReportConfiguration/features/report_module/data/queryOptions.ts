import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReportModules, updateReportModules } from "./api";
import { UpdateReportModulePayload } from "./schema";

export const REPORT_MODULES = "report-modules";


export const useFetchReportModules = (divisionId: string) => {

    return useQuery({

        queryKey: [REPORT_MODULES, divisionId],

        queryFn: () => fetchReportModules(divisionId),

        retry: false,

        refetchOnMount: false,

        refetchOnWindowFocus: false,
    });
};


export const useUpdateReportModules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateReportModulePayload) =>
            updateReportModules(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REPORT_MODULES] });
        }

    });
};