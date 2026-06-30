import { useMutation, useQuery } from "@tanstack/react-query";
import {
    fetchAllDevices,
    fetchCommandCatalog,
    sendDeviceCommands,
} from "./api";
import { DeviceCommandEntity } from "./schema";

export const ALL_DEVICES_KEY = "broadcast-all-devices";
export const COMMAND_CATALOG_KEY = "broadcast-command-catalog";

export const useAllDevices = () =>
    useQuery({
        queryKey: [ALL_DEVICES_KEY],
        queryFn: fetchAllDevices,
        retry: false,
        refetchOnWindowFocus: false,
    });

export const useCommandCatalog = () =>
    useQuery({
        queryKey: [COMMAND_CATALOG_KEY],
        queryFn: fetchCommandCatalog,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

export const useSendDeviceCommands = () =>
    useMutation({
        mutationFn: ({
            entities,
            onProgress,
        }: {
            entities: DeviceCommandEntity[];
            onProgress?: (sent: number, total: number) => void;
        }) => sendDeviceCommands(entities, onProgress),
    });
