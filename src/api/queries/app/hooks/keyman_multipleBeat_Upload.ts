import { useMutation } from "@tanstack/react-query"
import { KEYMAN_MULTIPLE_BEAT_UPLOAD } from "../queryKeys/queryKeys"
import postKeyManMultipleFileUpload from "../features/beat_upload/keymanMultipleBeatUpload"
import { IKeyManFormikBulkRequestInterface } from "../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface"









export const postKeyManFileUpload = () =>{
    return useMutation({
        mutationKey:[KEYMAN_MULTIPLE_BEAT_UPLOAD],
        mutationFn:(fileUploadRequest:IKeyManFormikBulkRequestInterface) =>{
            return postKeyManMultipleFileUpload(fileUploadRequest);
        },
        retry:false
    })
}