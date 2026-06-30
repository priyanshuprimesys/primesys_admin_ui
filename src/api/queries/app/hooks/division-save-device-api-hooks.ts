import { useMutation } from "@tanstack/react-query";
import { division_save_device_query } from "../queryKeys/queryKeys";
import { postDivisionDeviceData } from "../features/allDivisionDevices/save_division_device_api";
import { IAddDivisionFormikDevicesInterface } from "../../../../interfaces/AppInterfaces/AllDivisionDevices/AddDivisionDevicesInterface";

export const postDivisionDevice = () => {
  return useMutation({
    mutationKey: [division_save_device_query],
    mutationFn: (deviceRequest: IAddDivisionFormikDevicesInterface) => {
      return postDivisionDeviceData(deviceRequest);
    },
    retry: false,
  });
};
