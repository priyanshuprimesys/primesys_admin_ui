import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { bulkChangeLocation, destroyLocation, revertLocation } from "./api";
import { ILocationTransferRequest } from "./schema";

export const BULK_LOCATION_KEY = "bulk-location-change-key";
export const LOCATION_TRANSFER_KEY = "location-transfer-key";
export const REVERT_LOCATION_KEY = "revert-location-key";
export const DESTROY_LOCATION_KEY = "destroy-location-key";

export const useDestroyLocationMutation = () => {
    return useMutation({
        mutationKey: [DESTROY_LOCATION_KEY],
        mutationFn: (request: ILocationTransferRequest) => destroyLocation(request),
        retry: false,
        onSuccess: (data) => {
            toast.success(data.data.data.result);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useRevertLocationMutation = () => {
    return useMutation({
        mutationKey: [REVERT_LOCATION_KEY],
        mutationFn: (request: ILocationTransferRequest) => revertLocation(request),
        retry: false,
        onSuccess: (data) => {
            toast.success(data.data.data.result);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useLocationTransferMutation = () => {
    return useMutation({
        mutationKey: [LOCATION_TRANSFER_KEY],
        mutationFn: (request: ILocationTransferRequest) => bulkChangeLocation(request),
        retry: false,
        onSuccess: (data) => {
            toast.success(data.data.data.result);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};
