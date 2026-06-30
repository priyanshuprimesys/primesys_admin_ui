import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    controlErlangServer,
    fetchWhitelist,
    generateOtp,
    updateWhitelistStatus,
    uploadSim,
    verifyOtp,
} from "./api";
import { ServerAction, SimProvider, WhitelistQueryParams } from "./schema";

export const WHITELIST_KEY = "operations-sos-whitelist";

export const useFetchWhitelist = (params: WhitelistQueryParams = {}) => {
    return useQuery({
        queryKey: [WHITELIST_KEY, params.status ?? "ALL"],
        queryFn: () => fetchWhitelist(params),
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateWhitelistStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ deviceImei }: { deviceImei: string | number }) =>
            updateWhitelistStatus(deviceImei, "COMPLETED", "admin"),
        onSuccess: () => {
            // Refetch the list so the device moves from Pending to Completed.
            queryClient.invalidateQueries({ queryKey: [WHITELIST_KEY] });
        },
    });
};

export const useControlErlangServer = () =>
    useMutation({
        mutationFn: (action: ServerAction) => controlErlangServer(action),
    });

export const useGenerateOtp = () =>
    useMutation({ mutationFn: (userId: string) => generateOtp(userId) });

export const useVerifyOtp = () =>
    useMutation({
        mutationFn: ({ userId, otp }: { userId: string; otp: string }) =>
            verifyOtp(userId, otp),
    });

export const useUploadSim = () => {
    return useMutation({
        mutationFn: ({
            provider,
            file,
            createdBy,
        }: {
            provider: SimProvider;
            file: File;
            createdBy?: string;
        }) => uploadSim(provider, file, createdBy),
    });
};
