import { useMutation } from "@tanstack/react-query"
import { KEYMAN_SINGLE_BEAT_UPLOAD } from "../queryKeys/queryKeys"
import { IKeyManFormikRequestInterface } from "../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface"
import { postKeymanSingleDeviceBeatUpload } from "../features/beat_upload/keymanSingleDeviceBeatUpload"







export const postKeymanSingleBeat=() =>{
    return useMutation({
        mutationKey:[KEYMAN_SINGLE_BEAT_UPLOAD],
        mutationFn:(singleBeatRequest:IKeyManFormikRequestInterface)=>{
            return postKeymanSingleDeviceBeatUpload(singleBeatRequest);
        },
        retry:false
    })
}