import { useMutation } from "@tanstack/react-query"
import { REPLACE_DEVICE_IMEI } from "../queryKeys/queryKeys";
import { IDeviceReplaceRequestInterface } from "../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceReplaceRequestInterface";
import { postReplaceDeviceImei } from "../features/exchangeDevice/replaceDeviceImei";










export const usePostReplaceDeviceImeiKey = () =>{
    return useMutation({
        mutationKey:[REPLACE_DEVICE_IMEI],
        mutationFn:(replaceRequest:IDeviceReplaceRequestInterface)=>{
            return postReplaceDeviceImei(replaceRequest);
        },
        retry:false
    });
}