import { useMutation } from "@tanstack/react-query";
import { IDestroyBeatRequest } from "../interfaces/DestroyBeatRequest";
import { destroyUploadedBeat } from "../service/api";
import { BeatDestroyMutationKey } from "../service/queryKey";


export const DestroyBeatHook = () => {

    return useMutation({
        mutationKey: [BeatDestroyMutationKey],
        mutationFn: (request: IDestroyBeatRequest) => {
            return destroyUploadedBeat(request);
        },
        retry: false,
    })
}