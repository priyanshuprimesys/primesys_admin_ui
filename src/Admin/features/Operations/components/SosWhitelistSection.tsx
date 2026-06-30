import { useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Center,
    Spinner,
    Icon,
    Badge,
} from "@chakra-ui/react";

import { MdSos } from "react-icons/md";
import { FiInbox, FiRefreshCw, FiDownload, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import {
    useFetchWhitelist,
    useUpdateWhitelistStatus,
} from "../data/queryOptions";
import { fetchDeviceInfo, fetchSims } from "../data/api";
import {
    DeviceInfo,
    WhitelistEntry,
    mergeWhitelistEntries,
    normalizeProvider,
} from "../data/schema";
import {
    buildDeviceSimResolution,
    exportAirtelWhitelist,
    exportJioWhitelist,
} from "../data/whitelistTemplate";
import { WhitelistTable } from "./WhitelistTable";

const isPending = (entry: WhitelistEntry) =>
    (entry.status ?? "").toUpperCase() === "PENDING";

export const SosWhitelistSection = () => {
    const { data, isFetching, isError, error, refetch } = useFetchWhitelist();
    const [exporting, setExporting] = useState<"jio" | "airtel" | null>(null);
    const updateStatus = useUpdateWhitelistStatus();
    const [completingImei, setCompletingImei] = useState<string | null>(null);
    const [selectedImeis, setSelectedImeis] = useState<Set<number>>(new Set());
    const [bulkCompleting, setBulkCompleting] = useState(false);

    const handleMarkCompleted = (deviceImei: number) => {
        setCompletingImei(String(deviceImei));
        updateStatus.mutate(
            { deviceImei },
            {
                onSuccess: () =>
                    toast.success("Device marked completed — FN & SOS updated."),
                onError: (err) =>
                    toast.error(
                        (err as Error)?.message || "Failed to mark completed"
                    ),
                onSettled: () => setCompletingImei(null),
            }
        );
    };

    const entries = data ?? [];
    // API returns newest-first; we only re-group so pending sits above completed.
    // Within each bucket, a device's FN + SOS rows are merged into one record.
    const pending = mergeWhitelistEntries(entries.filter(isPending));
    const completed = mergeWhitelistEntries(
        entries.filter((entry) => !isPending(entry))
    );

    const toggleSelect = (imei: number, checked: boolean) =>
        setSelectedImeis((prev) => {
            const next = new Set(prev);
            if (checked) next.add(imei);
            else next.delete(imei);
            return next;
        });

    const toggleAll = (checked: boolean) =>
        setSelectedImeis((prev) => {
            const next = new Set(prev);
            pending.forEach((e) => {
                if (checked) next.add(e.device_imei);
                else next.delete(e.device_imei);
            });
            return next;
        });

    const handleMarkSelectedCompleted = async () => {
        const imeis = [...selectedImeis];
        if (imeis.length === 0) return;
        setBulkCompleting(true);
        try {
            await Promise.all(
                imeis.map((deviceImei) => updateStatus.mutateAsync({ deviceImei }))
            );
            toast.success(`${imeis.length} device(s) marked completed.`);
            setSelectedImeis(new Set());
        } catch (err) {
            toast.error(
                (err as Error)?.message || "Failed to mark some devices completed"
            );
        } finally {
            setBulkCompleting(false);
        }
    };

    // Resolve mobile/basket/imsi per device via the device API + SIM list, both
    // needed by the Airtel (mobile, basket) and Jio (imsi) sheets.
    const resolveRows = async (
        provider: "jio" | "airtel",
        rows: typeof pending
    ) => {
        const imeis = [...new Set(rows.map((e) => String(e.device_imei)))];
        const [sims, deviceInfos] = await Promise.all([
            fetchSims(provider),
            Promise.all(
                imeis.map(
                    async (imei) => [imei, await fetchDeviceInfo(imei)] as const
                )
            ),
        ]);
        const deviceInfoByImei = new Map<string, DeviceInfo | null>(deviceInfos);
        return buildDeviceSimResolution(deviceInfoByImei, sims);
    };

    const handleExport = async (provider: "jio" | "airtel") => {
        // If devices are selected, export only the selected ones of this
        // provider; otherwise export all pending devices of this provider.
        const providerRows = pending.filter(
            (e) => normalizeProvider(e.sim_provider) === provider
        );
        const rows =
            selectedImeis.size > 0
                ? providerRows.filter((e) => selectedImeis.has(e.device_imei))
                : providerRows;
        const label = provider === "jio" ? "Jio" : "Airtel";
        if (rows.length === 0) {
            toast.info(
                selectedImeis.size > 0
                    ? `No selected ${label} devices to export.`
                    : `No pending ${label} devices to export.`
            );
            return;
        }
        setExporting(provider);
        try {
            const resolution = await resolveRows(provider, rows);
            if (provider === "jio") {
                await exportJioWhitelist(rows, resolution);
            } else {
                await exportAirtelWhitelist(rows, resolution);
            }
            toast.success(`${label} whitelist prepared — ${rows.length} device(s).`);
        } catch (err) {
            toast.error(
                (err as Error)?.message || `Failed to prepare ${label} sheet`
            );
        } finally {
            setExporting(null);
        }
    };

    const handleExportJio = () => handleExport("jio");
    const handleExportAirtel = () => handleExport("airtel");

    return (
        <Box>
            <Flex align="center" justify="space-between" gap={2} mb={1} wrap="wrap">
                <Flex align="center" gap={2}>
                    <Icon as={MdSos} boxSize={6} color="red.500" />
                    <Heading size="md">SOS Whitelist</Heading>
                </Flex>
                <Flex align="center" gap={2} wrap="wrap">
                    <Button
                        size="sm"
                        colorScheme="orange"
                        leftIcon={<FiDownload />}
                        onClick={handleExportAirtel}
                        isLoading={exporting === "airtel"}
                        isDisabled={exporting !== null || isFetching}
                        loadingText="Preparing"
                    >
                        Prepare Airtel Whitelist
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FiDownload />}
                        onClick={handleExportJio}
                        isLoading={exporting === "jio"}
                        isDisabled={exporting !== null || isFetching}
                        loadingText="Preparing"
                    >
                        Prepare Jio Whitelist
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        colorScheme="teal"
                        leftIcon={<FiRefreshCw />}
                        onClick={() => refetch()}
                        isLoading={isFetching}
                    >
                        Refresh
                    </Button>
                </Flex>
            </Flex>
            <Text fontSize="sm" color="gray.500" mb={4}>
                All SOS whitelist entries — pending requests first, completed after.
            </Text>

            {isFetching ? (
                <Center py={16}>
                    <Spinner size="lg" thickness="3px" color="teal.400" />
                </Center>
            ) : isError ? (
                <Center py={16}>
                    <Text color="red.500">
                        {(error as Error)?.message ||
                            "Failed to load whitelist entries"}
                    </Text>
                </Center>
            ) : entries.length === 0 ? (
                <Center py={16} flexDirection="column" color="gray.400">
                    <Icon as={FiInbox} boxSize={8} mb={2} />
                    <Text>No whitelist entries found.</Text>
                </Center>
            ) : (
                <Flex direction="column" gap={6}>
                    {pending.length > 0 && (
                        <Box>
                            <Flex align="center" gap={2} mb={2} wrap="wrap">
                                <Badge colorScheme="yellow" px={2} py={0.5} borderRadius="md">
                                    Pending
                                </Badge>
                                <Text fontSize="sm" color="gray.500">
                                    {pending.length}
                                </Text>
                                {selectedImeis.size > 0 && (
                                    <Flex align="center" gap={2} ml="auto">
                                        <Text fontSize="sm" color="teal.600">
                                            {selectedImeis.size} selected
                                        </Text>
                                        <Button
                                            size="xs"
                                            colorScheme="green"
                                            leftIcon={<FiCheckCircle />}
                                            onClick={handleMarkSelectedCompleted}
                                            isLoading={bulkCompleting}
                                            loadingText="Marking"
                                        >
                                            Mark Selected Completed
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => setSelectedImeis(new Set())}
                                            isDisabled={bulkCompleting}
                                        >
                                            Clear
                                        </Button>
                                    </Flex>
                                )}
                            </Flex>
                            <WhitelistTable
                                entries={pending}
                                onComplete={handleMarkCompleted}
                                completingImei={completingImei}
                                selectedImeis={selectedImeis}
                                onToggleSelect={toggleSelect}
                                onToggleAll={toggleAll}
                            />
                        </Box>
                    )}

                    {completed.length > 0 && (
                        <Box>
                            <Flex align="center" gap={2} mb={2}>
                                <Badge colorScheme="green" px={2} py={0.5} borderRadius="md">
                                    Completed
                                </Badge>
                                <Text fontSize="sm" color="gray.500">
                                    {completed.length}
                                </Text>
                            </Flex>
                            <WhitelistTable entries={completed} />
                        </Box>
                    )}
                </Flex>
            )}
        </Box>
    );
};
