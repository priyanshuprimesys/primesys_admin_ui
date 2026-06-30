import { useMutation } from "@tanstack/react-query";
import { division_upload_query } from "../queryKeys/queryKeys";
import { IAddBulkDevicesInterface } from "../../../../interfaces/AppInterfaces/AllDivisionDevices/AddBulkDevicesInterface";
import { postUploadDevice } from "../features/device_Upload/device_upload_api";

export const useMutateDeviceUpload = () => {
  return useMutation({
    mutationKey: [division_upload_query],
    mutationFn: (deviceRequest: IAddBulkDevicesInterface) => {
      return postUploadDevice(deviceRequest);
    },
    retry: false,
  });
};
