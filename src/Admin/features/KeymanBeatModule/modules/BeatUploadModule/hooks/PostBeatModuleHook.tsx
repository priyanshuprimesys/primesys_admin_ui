import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadBeatModuleExcelFile } from "../services/api"
import { IBeatUploadFileRequest } from "../interfaces/IBeatUploadInterface";
import { toast } from "react-toastify";
import { BeatApprovalQueryKey } from "../../../components/ApprovalBeatModule/service/queryKey";




export const PostBeatModuleHook = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['post-beat-module-upload-key'],
        mutationFn: (request: IBeatUploadFileRequest) => {
            return uploadBeatModuleExcelFile(request);
        },
        retry: false,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [BeatApprovalQueryKey] });
            if (data.data.data.result.invalidRecords > 0) {
                toast.error("Records Invalid", {
                    position: "top-right"
                })
            }
            if (data.data.data.result.validRecords > 0) {
                toast.success("Beat Uploaded successfully", {
                    position: "top-right"
                });
            }
        }
    })
}