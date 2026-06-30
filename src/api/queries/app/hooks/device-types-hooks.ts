import { useQuery } from "@tanstack/react-query"
import { getAllDeviceTypes } from "../features/deviceTypes/device-type-api"



export const useGetAllDeviceTypeQuery = () => {
    return useQuery({
        queryKey: ["device-types-query"],
        queryFn: () => getAllDeviceTypes(),
        enabled: true,
        retryOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    })
}