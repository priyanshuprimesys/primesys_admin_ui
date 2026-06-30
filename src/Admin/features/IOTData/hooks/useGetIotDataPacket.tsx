import { useQuery } from "@tanstack/react-query"
import { IotDataPacket } from "../services/queryKey"
import { IOTDataRequest } from "../interface/IOTDataRequest"
import { getIotDataPacket } from "../services/api"






export const useGetIOTDataPacket = (request: IOTDataRequest) => {
    return useQuery({
        queryKey: [IotDataPacket, request],
        queryFn: () => getIotDataPacket(request),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!request.endTime && !!request.imei && !!request.startTime
    })
}