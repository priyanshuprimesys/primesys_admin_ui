import { useQuery } from "@tanstack/react-query";
import { division_device_detail_query } from "../queryKeys/queryKeys";
// import { getStudentDeviceDetails } from "../features/getStudentDeviceDetails/getStudentDeviceDetails";
import { getAllDivisionDevices } from "../features/allDivisionDevices/AllDivisionDevices_api";

export const useDivisionDeviceDetailQuery = () => {
  return useQuery({
    queryKey: [division_device_detail_query],
    queryFn: () => getAllDivisionDevices(),
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled:true
  });
};
