import { useMutation } from "@tanstack/react-query"
import { KEYMAN_SINGLE_BEAT_UPDATE } from "../queryKeys/queryKeys"
import { keymanUpdateSingleBeatUpdate } from "../features/beat_upload/keymanSingleBeatUpdate"
import { IKeymanFormikEditInterface } from "../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface"







export const useKeymanSingleBeatUpdate = () =>{
    return useMutation({
        mutationKey:[KEYMAN_SINGLE_BEAT_UPDATE],
        mutationFn:(keymanUpdateRequest:IKeymanFormikEditInterface)=>{
            return keymanUpdateSingleBeatUpdate(keymanUpdateRequest)
        },
        retry:false
    })
}