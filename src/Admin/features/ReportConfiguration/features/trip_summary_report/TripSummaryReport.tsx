import { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spinner,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { IDeviceType } from "../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";
import { useDeleteTripSummary, useFetchTripSummaryReport, useRegenerateTripSummary } from "./data/queryOptions";
import { TripReportDayStatus, TripSummaryDevices } from "./data/schema";

interface DateFilters {
    startDate: string;
    endDate: string;
    deviceType: string;
}

interface QueryParams {
    divisionId: string;
    deviceType: number;
    startDateTime: number;
    endDateTime: number;
}

const EMPTY_PARAMS: QueryParams = {
    divisionId: "",
    deviceType: 0,
    startDateTime: 0,
    endDateTime: 0,
};

const toUnix = (dateStr: string, eod = false) =>
    Math.floor(
        new Date(dateStr).setHours(eod ? 23 : 0, eod ? 59 : 0, eod ? 59 : 0, 0) / 1000
    );

const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });

// Build abbreviated code from boolean flags
const getCellCode = (status: TripReportDayStatus): string => {
    const parts: string[] = [];
    if (status.tripCompleted) parts.push("BC");
    if (status.tripNotCompleted) parts.push("BNC");
    if (status.overSpeed) parts.push("OS");
    if (status.deviceOff) parts.push("OFF");
    if (status.delayedStart) parts.push("DS");
    return parts.join("/");
};

// Priority coloring: DS → orange, OS → blue, OFF → red, BNC → dark, BC → green
const getCellColor = (code: string): string => {
    if (code.includes("DS")) return "#DD6B20";
    if (code.includes("OS")) return "#2B6CB0";
    if (code.includes("OFF")) return "#C53030";
    if (code.includes("BNC")) return "#2D3748";
    if (code.includes("BC")) return "#276749";
    return "#718096";
};

// ── Shared table styles ───────────────────────────────────────────────────────
const CELL_BASE: React.CSSProperties = {
    padding: "10px 14px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
    fontSize: "13px",
};

const STICKY_COL = (left: number, bg: string): React.CSSProperties => ({
    ...CELL_BASE,
    position: "sticky",
    left,
    zIndex: 1,
    background: bg,
    borderRight: "1px solid #CBD5E0",
});

const TH_BASE: React.CSSProperties = {
    ...CELL_BASE,
    background: "#EDF2F7",
    fontWeight: 600,
    borderBottom: "2px solid #CBD5E0",
};

const SINO_W = 56;
const NAME_W = 200;

const LEGEND_ITEMS = [
    { code: "BC", label: "Beat Complete", color: "#276749" },
    { code: "BNC", label: "Beat Not Complete", color: "#2D3748" },
    { code: "OS", label: "Overspeed", color: "#2B6CB0" },
    { code: "OFF", label: "Device OFF", color: "#C53030" },
    { code: "DS", label: "Delay Start", color: "#DD6B20" },
];

const STATUS_OPTIONS = ["All", "BC", "BNC", "OS", "OFF", "DS"];

interface TripSummaryProps {
    divisionId: string;
}

export const TripSummaryReport = ({ divisionId }: TripSummaryProps) => {
    const { deviceType } = useContext(DeviceTypeContext);

    const { mutate: regenerate, isPending: isRegenerating } = useRegenerateTripSummary();
    const { mutate: deleteReport, isPending: isDeleting } = useDeleteTripSummary();

    const today = new Date().toISOString().split("T")[0];

    const [filters, setFilters] = useState<DateFilters>({
        startDate: "",
        endDate: "",
        deviceType: "",
    });

    const [queryParams, setQueryParams] = useState<QueryParams>(EMPTY_PARAMS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const { isOpen: isRegenOpen, onOpen: onRegenOpen, onClose: onRegenClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [regenForm, setRegenForm] = useState({ date: "", deviceType: `${filters.deviceType}` });
    const [deleteForm, setDeleteForm] = useState({ date: "", deviceType: `${filters.deviceType}` });

    const canFetch = !!filters.startDate && !!filters.endDate && !!filters.deviceType;
    const canRegen = !!regenForm.date && !!regenForm.deviceType;

    const handleGetReport = () => {
        if (!canFetch) return;
        setQueryParams({
            divisionId,
            deviceType: Number(filters.deviceType),
            startDateTime: toUnix(filters.startDate),
            endDateTime: toUnix(filters.endDate, true),
        });
    };

    const handleRegenerate = () => onRegenOpen();

    const handleSubmitRegen = () => {
        if (!canRegen) return;
        regenerate(
            {
                divisionId,
                deviceType: Number(regenForm.deviceType),
                reportDate: toUnix(regenForm.date),
            },
            {
                onSuccess: () => {
                    setRegenForm({ date: "", deviceType: "" });
                    onRegenClose();
                },
            }
        );
    };

    useEffect(() => {
        setRegenForm(prev => ({
            ...prev,
            deviceType: filters.deviceType,
        }));
        setDeleteForm(prev => ({
            ...prev,
            deviceType: filters.deviceType,
        }));
    }, [filters.deviceType]);

    const { data, isLoading } = useFetchTripSummaryReport(queryParams);

    // Sorted unique report dates (unix timestamps)
    const reportDates: number[] = useMemo(
        () =>
            Array.from(
                new Set((data?.data?.result ?? []).map((item) => item.reportOfDay ?? 0))
            )
                .filter(Boolean)
                .sort((a, b) => a - b),
        [data]
    );

    // Pivot flat list → one row per device, each with per-day status array
    const result: TripSummaryDevices[] = useMemo(
        () =>
            Object.values(
                (data?.data?.result ?? []).reduce(
                    (acc: Record<number, TripSummaryDevices>, item) => {
                        const deviceNo = item.deviceNo ?? 0;
                        if (!acc[deviceNo]) {
                            acc[deviceNo] = {
                                deviceName: item.deviceName || "",
                                deviceNo,
                                status: [],
                            };
                        }
                        acc[deviceNo].status.push({
                            reportDay: item.reportOfDay || 0,
                            deviceOff: item.deviceOff,
                            tripCompleted: item.tripCompleted,
                            tripNotCompleted: item.tripNotCompleted,
                            overSpeed: item.overSpeed,
                            delayedStart: item.delayedStart,
                            inActiveDevice: item.inActiveDevice,
                        });
                        return acc;
                    },
                    {}
                )
            ),
        [data]
    );

    // Apply search + status filter
    const visibleDevices = useMemo(() => {
        return result.filter((device) => {
            if (search && !device.deviceName.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (statusFilter !== "All") {
                return device.status.some((s) => getCellCode(s).includes(statusFilter));
            }
            return true;
        });
    }, [result, search, statusFilter]);

    const hasFetched = !!queryParams.divisionId;


    const handleDelete = () => onDeleteOpen();

    const handleSubmitDelete = () => {
        if (!deleteForm.date || !deleteForm.deviceType) return;
        deleteReport(
            {
                divisionId,
                deviceType: Number(deleteForm.deviceType),
                reportDate: toUnix(deleteForm.date),
            },
            {
                onSuccess: () => {
                    setDeleteForm({ date: "", deviceType: "" });
                    onDeleteClose();
                },
            }
        );
    };

    return (
        <Box width="100%">
            <Box mb={4}>
                <Text fontWeight="600" fontSize="xl">
                    Trip Report Summary
                </Text>
            </Box>

            {/* ── Filter bar ───────────────────────────────────────────────── */}
            <Flex
                width="100%"
                p={5}
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="gray.200"
                gap={4}
                flexWrap="wrap"
                mb={6}
            >
                <Box flex={1} minW="180px">
                    <Text mb={2} fontWeight="600" fontSize="sm">Start Date</Text>
                    <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                        max={filters.endDate || today}
                    />
                </Box>

                <Box flex={1} minW="180px">
                    <Text mb={2} fontWeight="600" fontSize="sm">End Date</Text>
                    <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                        min={filters.startDate || undefined}
                        max={today}
                    />
                </Box>

                <Box flex={1} minW="180px">
                    <Text mb={2} fontWeight="600" fontSize="sm">Device Type</Text>
                    <Select
                        placeholder="Select Device Type"
                        value={filters.deviceType}
                        onChange={(e) => setFilters((p) => ({ ...p, deviceType: e.target.value }))}
                    >
                        {deviceType?.data?.result?.map((item: IDeviceType) => (
                            <option key={item.id} value={item.deviceTypeId}>
                                {item.deviceType}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Box flex={1} minW="220px" display="flex" alignItems="end" gap={3}>
                    <Button
                        width="100%"
                        colorScheme="teal"
                        isDisabled={!canFetch}
                        onClick={handleGetReport}
                    >
                        Get Report
                    </Button>
                    <Button
                        width="100%"
                        colorScheme="orange"
                        isDisabled={!canFetch}
                        onClick={handleRegenerate}
                    >
                        Regenerate Report
                    </Button>
                </Box>
            </Flex>

            {/* ── Loading ──────────────────────────────────────────────────── */}
            {isLoading && (
                <Flex justifyContent="center" py={10}>
                    <Spinner size="lg" color="teal.500" />
                </Flex>
            )}

            {/* ── Table section ────────────────────────────────────────────── */}
            {!isLoading && result.length > 0 && (
                <Box
                    bg="white"
                    borderRadius="16px"
                    border="1px solid"
                    borderColor="gray.200"
                    overflow="hidden"
                >
                    {/* Toolbar: search | legend | status filter */}
                    <Flex
                        px={4}
                        py={3}
                        align="center"
                        gap={4}
                        flexWrap="wrap"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                    >
                        <Input
                            placeholder="Search by device no...."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="sm"
                            maxW="220px"
                            borderRadius="8px"
                        />

                        <Flex align="center" gap={3} flex={1} flexWrap="wrap">
                            {LEGEND_ITEMS.map((item) => (
                                <Text key={item.code} fontSize="xs" fontWeight="600" color="gray.600">
                                    <Text as="span" color={item.color} fontWeight="700">
                                        {item.code}
                                    </Text>
                                    {": "}
                                    {item.label}
                                </Text>
                            ))}
                        </Flex>

                        <Flex align="center" gap={3}>
                            <Select
                                size="sm"
                                maxW="180px"
                                borderRadius="8px"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s === "All" ? "Select Report Status" : s}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                width="100%"
                                colorScheme="red"
                                onClick={handleDelete}
                            >
                                {isDeleting ? "Deleting..." : "Delete Summary"}
                            </Button>
                        </Flex>




                    </Flex>

                    {/* Scrollable table */}
                    <Box overflowX="auto">
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            ...TH_BASE,
                                            position: "sticky",
                                            left: 0,
                                            zIndex: 2,
                                            textAlign: "center",
                                            width: SINO_W,
                                            minWidth: SINO_W,
                                            borderRight: "1px solid #CBD5E0",
                                        }}
                                    >
                                        SlNo
                                    </th>
                                    <th
                                        style={{
                                            ...TH_BASE,
                                            position: "sticky",
                                            left: SINO_W,
                                            zIndex: 2,
                                            textAlign: "left",
                                            minWidth: NAME_W,
                                            borderRight: "2px solid #A0AEC0",
                                        }}
                                    >
                                        Device Name
                                    </th>
                                    {reportDates.map((ts) => (
                                        <th
                                            key={ts}
                                            style={{
                                                ...TH_BASE,
                                                textAlign: "center",
                                                minWidth: 120,
                                                borderRight: "1px solid #E2E8F0",
                                            }}
                                        >
                                            {formatDate(ts)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleDevices.map((device, rowIdx) => {
                                    const rowBg = rowIdx % 2 === 0 ? "#fff" : "#F7FAFC";
                                    return (
                                        <tr key={device.deviceNo}>
                                            {/* SlNo — sticky col 1 */}
                                            <td
                                                style={{
                                                    ...STICKY_COL(0, rowBg),
                                                    textAlign: "center",
                                                    width: SINO_W,
                                                    minWidth: SINO_W,
                                                    color: "#4A5568",
                                                }}
                                            >
                                                {rowIdx + 1}
                                            </td>

                                            {/* Device Name — sticky col 2 */}
                                            <td
                                                style={{
                                                    ...STICKY_COL(SINO_W, rowBg),
                                                    fontWeight: 500,
                                                    borderRight: "2px solid #A0AEC0",
                                                }}
                                            >
                                                {device.deviceName || "—"}
                                            </td>

                                            {/* Date cells — one per report date */}
                                            {reportDates.map((ts) => {
                                                const dayStatus = device.status.find(
                                                    (s) => s.reportDay === ts
                                                );
                                                const code = dayStatus ? getCellCode(dayStatus) : "";
                                                return (
                                                    <td
                                                        key={ts}
                                                        style={{
                                                            ...CELL_BASE,
                                                            background: rowBg,
                                                            textAlign: "center",
                                                            borderRight: "1px solid #E2E8F0",
                                                        }}
                                                    >
                                                        {code ? (
                                                            <Text
                                                                fontSize="xs"
                                                                fontWeight="700"
                                                                color={getCellColor(code)}
                                                            >
                                                                {code}
                                                            </Text>
                                                        ) : (
                                                            <Text fontSize="xs" color="gray.300">—</Text>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            )}

            {/* ── Empty state ──────────────────────────────────────────────── */}
            {!isLoading && hasFetched && result.length === 0 && (
                <Flex justifyContent="center" py={10}>
                    <Text color="gray.400" fontSize="sm">
                        No data found for the selected range.
                    </Text>
                </Flex>
            )}

            <Modal isOpen={isRegenOpen} onClose={onRegenClose} isCentered size="sm">
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px">
                    <ModalHeader
                        fontSize="sm"
                        fontWeight="700"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        py={3.5}
                    >
                        Regenerate Trip Report
                    </ModalHeader>
                    <ModalCloseButton top={3} />

                    <ModalBody py={5}>
                        <Flex direction="column" gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1.5}>
                                    Report Date
                                </Text>
                                <Input
                                    type="date"
                                    size="sm"
                                    borderRadius="8px"
                                    max={today}
                                    value={regenForm.date}
                                    onChange={(e) =>
                                        setRegenForm((p) => ({ ...p, date: e.target.value }))
                                    }
                                />
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1.5}>
                                    Device Type
                                </Text>
                                <Select
                                    size="sm"
                                    borderRadius="8px"
                                    placeholder="Select device type"
                                    value={regenForm.deviceType}
                                    onChange={(e) =>
                                        setRegenForm((p) => ({ ...p, deviceType: e.target.value }))
                                    }
                                >
                                    {deviceType?.data?.result?.map((item: IDeviceType) => (
                                        <option key={item.id} value={item.deviceTypeId}>
                                            {item.deviceType}
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        </Flex>
                    </ModalBody>

                    <ModalFooter gap={2} borderTop="1px solid" borderColor="gray.100" py={3}>
                        <Button size="sm" variant="ghost" onClick={onRegenClose}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="orange"
                            isDisabled={!canRegen}
                            isLoading={isRegenerating}
                            loadingText="Regenerating…"
                            onClick={handleSubmitRegen}
                        >
                            Regenerate
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* ── Delete Modal ── */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered size="sm">
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px">
                    <ModalHeader
                        fontSize="sm"
                        fontWeight="700"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        py={3.5}
                    >
                        Delete Trip Summary
                    </ModalHeader>
                    <ModalCloseButton top={3} />

                    <ModalBody py={5}>
                        <Flex direction="column" gap={4}>
                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1.5}>
                                    Report Date
                                </Text>
                                <Input
                                    type="date"
                                    size="sm"
                                    borderRadius="8px"
                                    min={filters.startDate || undefined}
                                    max={filters.endDate || today}
                                    value={deleteForm.date}
                                    onChange={(e) =>
                                        setDeleteForm((p) => ({ ...p, date: e.target.value }))
                                    }
                                />
                                {filters.startDate && filters.endDate && (
                                    <Text fontSize="xs" color="gray.400" mt={1}>
                                        Pick a date between {filters.startDate} and {filters.endDate}
                                    </Text>
                                )}
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="600" mb={1.5}>
                                    Device Type
                                </Text>
                                <Select
                                    size="sm"
                                    borderRadius="8px"
                                    placeholder="Select device type"
                                    value={deleteForm.deviceType}
                                    onChange={(e) =>
                                        setDeleteForm((p) => ({ ...p, deviceType: e.target.value }))
                                    }
                                >
                                    {deviceType?.data?.result?.map((item: IDeviceType) => (
                                        <option key={item.id} value={item.deviceTypeId}>
                                            {item.deviceType}
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        </Flex>
                    </ModalBody>

                    <ModalFooter gap={2} borderTop="1px solid" borderColor="gray.100" py={3}>
                        <Button size="sm" variant="ghost" onClick={onDeleteClose}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="red"
                            isDisabled={!deleteForm.date || !deleteForm.deviceType}
                            isLoading={isDeleting}
                            loadingText="Deleting…"
                            onClick={handleSubmitDelete}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
