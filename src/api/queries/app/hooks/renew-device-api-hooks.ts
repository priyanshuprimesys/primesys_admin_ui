import { useMutation } from "@tanstack/react-query";
import { renew_device_query } from "../queryKeys/queryKeys";
import { IRenewDeviceRequestInterface } from "../../../../interfaces/AppInterfaces/RenewDeviceInterface/RenewDeviceRequestInterface";
import { postRenewDevice } from "../features/renewDevice/renew-device-api";

export const useDeviceRenewQuery = () => {
  return useMutation({
    mutationKey: [renew_device_query],
    mutationFn: (renewRequest: IRenewDeviceRequestInterface) => {
      return postRenewDevice(renewRequest);
    },
    retry: false,
  });
};
