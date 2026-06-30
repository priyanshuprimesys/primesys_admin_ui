import { useQuery } from "@tanstack/react-query"
import { device_exchange_query_key } from "../services/queryKey"
import { getExchangeDevices } from "../services/api"
import { DeviceExchageGetRequest } from "../interface/DeviceExchageGetRequest"







export const useGetDeviceExchangeDevices = (exchangeRequest:DeviceExchageGetRequest)=>{
    return useQuery({
        queryKey:[device_exchange_query_key,exchangeRequest.size],
        queryFn:()=> getExchangeDevices(exchangeRequest),
        enabled:true,
        retryOnMount:false,
        refetchOnWindowFocus:false,
        retry:false
    })
}