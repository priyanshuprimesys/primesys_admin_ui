import { useMutation } from "@tanstack/react-query"
import { exchangeDeviceKey } from "../queryKeys/queryKeys"
import { exchangeDevicePost } from "../features/exchangeDevice/exchangeDevicePost"
import { DeviceExchangeRequestInterface } from "../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeRequestInterface"





export const useExchangeDeviceQuery = () =>{
    return useMutation({
        mutationKey:[exchangeDeviceKey],
        mutationFn:(payload:DeviceExchangeRequestInterface)=>{
           return exchangeDevicePost(payload.oldDeviceId,payload.newDeviceId,payload.userId)
        } ,
        retry:false,
    })
}