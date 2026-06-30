import { useQuery } from "@tanstack/react-query";
import { admin_division_id_device_query } from "../queryKeys/queryKeys";
import { getAllDivisionDevice } from "../features/allDivisionDevices/admin_get_all_division_device_details_api";

export const useGetAdminDivisionDevice = (divisionId: string) => {
  return useQuery({
    queryKey: [admin_division_id_device_query],
    queryFn: () => getAllDivisionDevice(divisionId),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!divisionId,
  });
};
