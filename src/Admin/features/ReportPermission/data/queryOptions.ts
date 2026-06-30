import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IReportPermissionPatchRequest } from "./schema";
import { patchUpdateReportModulePermission } from "./api";
import { toast } from "react-toastify";
import { PERMISSION_BY_ID } from "./report-permission-query";





export const useReportModuleMutation = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["report-module-patch"],
        mutationFn: (payload: IReportPermissionPatchRequest) => {
            return patchUpdateReportModulePermission(payload);
        },
        retry: false,
        onSuccess: (data) => {
            toast.success("Report Module updated successfully", {
                delay: 400,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
            });
            queryClient.invalidateQueries({ queryKey: [PERMISSION_BY_ID, data.data.data.result.id] });
        },
        onError: () => {
            toast.error("Report Module not updated", {
                delay: 400,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
            });
        }
    })
}