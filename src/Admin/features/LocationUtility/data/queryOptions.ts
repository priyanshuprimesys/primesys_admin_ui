import { useMutation, useQuery } from "@tanstack/react-query"
import { IDeviceDestroyRequest, IDeviceLocationRequest } from "./schema";
import { deleteLocations, getDeviceLocations } from "./api";
import { toast } from "react-toastify";


export const LOCATION_BASE_KEY = "device-location-base-key";





export const useDeviceLocationsQuery = (request: IDeviceLocationRequest) => {
    return useQuery({
        queryKey: [LOCATION_BASE_KEY, request],
        queryFn: () => getDeviceLocations(request),
        retry: 1,
        enabled: request.deviceImei != 0 || request.startTime != 0 || request.endTime != 0
    });
}



export const useMutateLocations = () => {
    return useMutation({
        mutationKey: [LOCATION_BASE_KEY],
        mutationFn: (request: IDeviceDestroyRequest) => {
            return deleteLocations(request);
        },
        retry: false,
        onSuccess: (data) => {
            toast.success(data.data.data.result);
        },
        onError: (data) => {
            toast.error(data.message);
        }
    })
}