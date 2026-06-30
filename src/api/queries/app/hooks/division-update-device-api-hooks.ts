import { useMutation } from "@tanstack/react-query";
import { division_update_device_query } from "../queryKeys/queryKeys";
import { IUpdateDivisionDevicesInterface } from "../../../../interfaces/AppInterfaces/AllDivisionDevices/UpdateDivisionDevicesInterface";
import { updateDivisionDeviceData } from "../features/allDivisionDevices/update_division_device_api";

export const updateDivisionDevice = () => {
  return useMutation({
    mutationKey: [division_update_device_query],
    mutationFn: (updateRequest: IUpdateDivisionDevicesInterface) => {
      return updateDivisionDeviceData(updateRequest);
    },
    retry: false,
  });
};
