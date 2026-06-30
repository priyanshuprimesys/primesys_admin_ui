import { useMutation } from "@tanstack/react-query"
import { KEYMAN_SINGLE_BEAT_DELETE } from "../queryKeys/queryKeys"
import { keymanSingleBeatDelete } from "../features/beat_upload/keymanSingleDelete"
import { IKeymanSingleBeatDeleteInterface } from "../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface"







export const useKeymanSingleBeatDeleteQuery = () =>{
    return useMutation({
        mutationKey:[KEYMAN_SINGLE_BEAT_DELETE],
        mutationFn:(keymanDelRequest:IKeymanSingleBeatDeleteInterface)=>{
            return keymanSingleBeatDelete(keymanDelRequest);
        },
        retry:false
    })
}