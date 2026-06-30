import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { DeviceReportConfig, IDivisionReportConfig, ReportDeviceConfigStatus } from "../data/schema";
import { toast } from "react-hot-toast";
import { useUpdateDeviceReportStatus } from "../data/queryOptions";

export interface ReportDeviceConfigTableHandle {
    applyAllActive: (value: boolean) => void;
    applyAllReport: (value: boolean) => void;
    submitDevicesByNos: (deviceNos: number[]) => void;
    updateAll: () => void;
}

interface IReportDeviceConfig {
    isLoading: boolean;
    data: IDivisionReportConfig[];
    divisionId: string;
    selectedDeviceNos?: number[];
}

// composite key avoids collisions if deviceNo repeats across divisions
const makeKey = (divisionName: string, deviceNo: number) => `${divisionName}::${deviceNo}`;

export const ReportDeviceConfigTable = forwardRef<ReportDeviceConfigTableHandle, IReportDeviceConfig>(
    ({ isLoading, data, divisionId, selectedDeviceNos }, ref) => {
        const { mutate: updateStatus } = useUpdateDeviceReportStatus();
        const selectedSet = useMemo(() => new Set(selectedDeviceNos ?? []), [selectedDeviceNos]);

        const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});
        const [reportMap, setReportMap] = useState<Record<string, boolean>>({});
        const [pageMap, setPageMap] = useState<Record<string, number>>({});
        const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
        const [deviceQuery, setDeviceQuery] = useState("");
        const [showZero, setShowZero] = useState(false);

        const pageSize = 10;

        const zeroCount = useMemo(
            () => data.filter((div) => (div.devices ?? []).length === 0).length,
            [data]
        );

        const filteredData = useMemo(() => {
            const q = deviceQuery.trim().toLowerCase();
            return data
                .filter((div) => {
                    const len = (div.devices ?? []).length;
                    return showZero ? len === 0 : len > 0;
                })
                .map((div) => ({
                    ...div,
                    devices: q
                        ? (div.devices ?? []).filter(
                            (d) =>
                                String(d.deviceNo).includes(q) ||
                                d.deviceName.toLowerCase().includes(q)
                        )
                        : (div.devices ?? []),
                }))
                .filter((div) => !q || div.devices.length > 0);
        }, [data, deviceQuery, showZero]);


        useEffect(() => {
            if (!data?.length) return;

            const activeInitial: Record<string, boolean> = {};
            const reportInitial: Record<string, boolean> = {};

            data.forEach((div) =>
                div.devices.forEach((d) => {
                    const key = makeKey(div.divisionName, d.deviceNo);

                    activeInitial[key] = d.activeStatus;
                    reportInitial[key] = d.reportEnable;
                })
            );

            setActiveMap(activeInitial);
            setReportMap(reportInitial);
        }, [data]);

        const handleActiveToggle = (divisionName: string, deviceNo: number) => {
            const key = makeKey(divisionName, deviceNo);
            setActiveMap((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));
            setDirtyKeys((prev) => new Set(prev).add(key));
        };

        const handleReportToggle = (divisionName: string, deviceNo: number) => {
            const key = makeKey(divisionName, deviceNo);
            setReportMap((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));
            setDirtyKeys((prev) => new Set(prev).add(key));
        };

        const handleFinalUpdate = (division: IDivisionReportConfig) => {
            const changedDevices = division.devices.filter((device) =>
                dirtyKeys.has(makeKey(division.divisionName, device.deviceNo))
            );

            if (changedDevices.length === 0) {
                toast.error("No changes to update.");
                return;
            }

            const devices = changedDevices.map((device) => {
                const key = makeKey(division.divisionName, device.deviceNo);
                return {
                    devices: String(device.deviceNo),
                    activeStatus: activeMap[key] ?? device.activeStatus,
                    reportEnable: reportMap[key] ?? device.reportEnable,
                };
            });

            const payload: ReportDeviceConfigStatus = {
                divisionId,
                deviceTypeId: division.devices[0]?.deviceType ?? 0,
                devices,
            };

            updateStatus(payload, {
                onSuccess: () => {
                    toast.success(`${division.divisionName} updated successfully`);
                    setDirtyKeys((prev) => {
                        const next = new Set(prev);
                        changedDevices.forEach((d) =>
                            next.delete(makeKey(division.divisionName, d.deviceNo))
                        );
                        return next;
                    });
                },
                onError: () => {
                    toast.error(`Failed to update ${division.divisionName}`);
                },
            });
        };


        const handleSelectAllActiveToggle = (divisionName: string, devices: DeviceReportConfig[]) => {
            const allActive = devices.every(
                (d) => activeMap[makeKey(divisionName, d.deviceNo)] ?? d.activeStatus
            );
            const next = !allActive;
            const updates: Record<string, boolean> = {};
            devices.forEach((d) => { updates[makeKey(divisionName, d.deviceNo)] = next; });
            setActiveMap((prev) => ({ ...prev, ...updates }));
            setDirtyKeys((prev) => {
                const next = new Set(prev);
                devices.forEach((d) => next.add(makeKey(divisionName, d.deviceNo)));
                return next;
            });
        };

        const handleSelectAllReportToggle = (divisionName: string, devices: DeviceReportConfig[]) => {
            const allEnabled = devices.every(
                (d) => reportMap[makeKey(divisionName, d.deviceNo)] ?? d.reportEnable
            );
            const next = !allEnabled;
            const updates: Record<string, boolean> = {};
            devices.forEach((d) => { updates[makeKey(divisionName, d.deviceNo)] = next; });
            setReportMap((prev) => ({ ...prev, ...updates }));
            setDirtyKeys((prev) => {
                const next = new Set(prev);
                devices.forEach((d) => next.add(makeKey(divisionName, d.deviceNo)));
                return next;
            });
        };


        const applyAllActive = (value: boolean) => {
            if (!data?.length) return;
            const updates: Record<string, boolean> = {};
            data.forEach((div) =>
                div.devices.forEach((d) => { updates[makeKey(div.divisionName, d.deviceNo)] = value; })
            );
            setActiveMap((prev) => ({ ...prev, ...updates }));
            setDirtyKeys((prev) => {
                const next = new Set(prev);
                data.forEach((div) => div.devices.forEach((d) => next.add(makeKey(div.divisionName, d.deviceNo))));
                return next;
            });
        };

        const applyAllReport = (value: boolean) => {
            if (!data?.length) return;
            const updates: Record<string, boolean> = {};
            data.forEach((div) =>
                div.devices.forEach((d) => { updates[makeKey(div.divisionName, d.deviceNo)] = value; })
            );
            setReportMap((prev) => ({ ...prev, ...updates }));
            setDirtyKeys((prev) => {
                const next = new Set(prev);
                data.forEach((div) => div.devices.forEach((d) => next.add(makeKey(div.divisionName, d.deviceNo))));
                return next;
            });
        };

        useImperativeHandle(ref, () => ({
            applyAllActive,
            applyAllReport,
            submitDevicesByNos: (deviceNos: number[]) => {
                if (!data?.length || !deviceNos.length) return;

                const searchSet = new Set(deviceNos);
                const foundNos = new Set<number>();

                data.forEach((div) => {
                    const matched = div.devices.filter((d) => searchSet.has(d.deviceNo));
                    if (!matched.length) return;

                    matched.forEach((d) => foundNos.add(d.deviceNo));

                    const payload: ReportDeviceConfigStatus = {
                        divisionId,
                        deviceTypeId: matched[0].deviceType,
                        devices: matched.map((d) => {
                            const key = makeKey(div.divisionName, d.deviceNo);
                            return {
                                devices: String(d.deviceNo),
                                activeStatus: activeMap[key] ?? d.activeStatus,
                                reportEnable: reportMap[key] ?? d.reportEnable,
                            };
                        }),
                    };

                    updateStatus(payload, {
                        onSuccess: () =>
                            toast.success(`Updated ${matched.length} device(s) in ${div.divisionName}`),
                        onError: () =>
                            toast.error(`Failed to update devices in ${div.divisionName}`),
                    });

                    // clear dirty state for submitted devices
                    setDirtyKeys((prev) => {
                        const next = new Set(prev);
                        matched.forEach((d) => next.delete(makeKey(div.divisionName, d.deviceNo)));
                        return next;
                    });
                });

                const notFound = deviceNos.filter((no) => !foundNos.has(no));
                if (notFound.length) {
                    toast.error(`Device(s) not found: ${notFound.join(", ")}`);
                }
            },
            updateAll: () => {
                if (!data?.length) return;
                const divisionsWithChanges = data.filter((div) =>
                    div.devices.some((d) => dirtyKeys.has(makeKey(div.divisionName, d.deviceNo)))
                );
                if (!divisionsWithChanges.length) {
                    toast.error("No changes to update.");
                    return;
                }
                divisionsWithChanges.forEach((div) => handleFinalUpdate(div));
            },
        }));

        if (isLoading) {
            return (
                <Flex justify="center" py={10}>
                    <Spinner size="lg" />
                </Flex>
            );
        }

        if (!data?.length) {
            return (
                <Box mt={6} p={6} borderWidth="1px" borderRadius="lg" textAlign="center">
                    <Text color="gray.500">No report configuration found.</Text>
                </Box>
            );
        }


        const totalDevices = data.reduce((sum, div) => sum + div.devices.length, 0);

        return (
            <Box mt={6}>
                {/* Bulk actions */}
                <Box
                    mb={4}
                    px={4}
                    py={3}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                >
                    <Flex align="center" gap={2} mb={2}>
                        <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                            Select All —
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            {totalDevices} devices across {data.length} divisions
                        </Text>
                    </Flex>

                    <Flex gap={2} flexWrap="wrap">
                        <Button size="sm" colorScheme="green" variant="solid" onClick={() => applyAllActive(true)}>
                            Active All
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" onClick={() => applyAllActive(false)}>
                            Inactive All
                        </Button>

                        <Box w="1px" bg="gray.300" mx={1} />

                        <Button size="sm" colorScheme="blue" variant="solid" onClick={() => applyAllReport(true)}>
                            Enable Report All
                        </Button>
                        <Button size="sm" colorScheme="orange" variant="outline" onClick={() => applyAllReport(false)}>
                            Disable Report All
                        </Button>
                    </Flex>
                </Box>

                {/* Search + zero-device filter */}
                <Flex gap={3} mb={4} align="center">
                    <InputGroup size="md" flex={1}>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search by device no or name..."
                            value={deviceQuery}
                            onChange={(e) => setDeviceQuery(e.target.value)}
                            bg="white"
                            borderColor="black"
                            borderWidth="2px"
                            borderRadius="lg"
                            _hover={{ borderColor: "black" }}
                            focusBorderColor="black"
                        />
                    </InputGroup>

                    {zeroCount > 0 && (
                        <Button
                            size="md"
                            variant={showZero ? "solid" : "outline"}
                            colorScheme={showZero ? "orange" : "gray"}
                            onClick={() => setShowZero((v) => !v)}
                            flexShrink={0}
                        >
                            {showZero ? "Hide" : "Show"} Zero Device Divisions ({zeroCount})
                        </Button>
                    )}
                </Flex>

                {filteredData.length === 0 && (
                    <Flex justify="center" py={10}>
                        <Text color="gray.400" fontSize="sm">No devices match "{deviceQuery}"</Text>
                    </Flex>
                )}

                {filteredData.map((division, index) => (
                    <Box
                        key={`${division.divisionName}-${index}`}
                        mb={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {/* Division header */}
                        <Flex
                            justify="space-between"
                            align="center"
                            px={5}
                            py={4}
                            bg="gray.50"
                        >
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                    {division.divisionName}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Total Devices: {division.devices.length}
                                </Text>
                            </Box>

                            <Flex align="center" gap={3}>
                                <Badge
                                    colorScheme={division.activeStatus ? "green" : "red"}
                                    px={2} py={1} borderRadius="md"
                                >
                                    {division.activeStatus ? "Active" : "Inactive"}
                                </Badge>
                                <Badge
                                    colorScheme={division.reportEnable ? "green" : "red"}
                                    px={2} py={1} borderRadius="md"
                                >
                                    {division.reportEnable ? "Report Enabled" : "Report Disabled"}
                                </Badge>
                            </Flex>
                        </Flex>

                        <Divider />

                        {(() => {
                            const currentPage = pageMap[division.divisionName] || 1;

                            const totalPages = Math.ceil(
                                division.devices.length / pageSize
                            );

                            const paginatedDevices = division.devices.slice(
                                (currentPage - 1) * pageSize,
                                currentPage * pageSize
                            );

                            const setDivisionPage = (page: number) => {
                                setPageMap((prev) => ({
                                    ...prev,
                                    [division.divisionName]: page,
                                }));
                            };

                            return (
                                <>
                                    <TableContainer>
                                        <Table variant="simple" size="sm">
                                            <Thead bg="gray.50">
                                                <Tr>
                                                    <Th>Device No</Th>
                                                    <Th>Device Name</Th>
                                                    <Th>Device Type</Th>
                                                    <Th>Shift Type</Th>
                                                    <Th>
                                                        <Flex align="center" gap={2}>
                                                            <Switch
                                                                colorScheme="green"
                                                                isChecked={division.devices.every(
                                                                    (d) => activeMap[makeKey(division.divisionName, d.deviceNo)] ?? d.activeStatus
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectAllActiveToggle(division.divisionName, division.devices)
                                                                }
                                                            />
                                                            <Text fontSize="xs" fontWeight="semibold">Active Status</Text>
                                                        </Flex>
                                                    </Th>
                                                    <Th>
                                                        <Flex align="center" gap={2}>
                                                            <Switch
                                                                colorScheme="blue"
                                                                isChecked={division.devices.every(
                                                                    (d) => reportMap[makeKey(division.divisionName, d.deviceNo)] ?? d.reportEnable
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectAllReportToggle(division.divisionName, division.devices)
                                                                }
                                                            />
                                                            <Text fontSize="xs" fontWeight="semibold">Report Status</Text>
                                                        </Flex>
                                                    </Th>
                                                    <Th isNumeric>Distance Margin</Th>
                                                    <Th isNumeric>Time Margin</Th>
                                                </Tr>
                                            </Thead>

                                            <Tbody>
                                                {paginatedDevices.map((device) => {
                                                    const key = makeKey(
                                                        division.divisionName,
                                                        device.deviceNo
                                                    );

                                                    const isActive =
                                                        activeMap[key] ??
                                                        device.activeStatus;

                                                    const isReportEnabled =
                                                        reportMap[key] ??
                                                        device.reportEnable;

                                                    const isSelected = selectedSet.has(device.deviceNo);
                                                    return (
                                                        <Tr
                                                            key={key}
                                                            bg={isSelected ? "blue.50" : undefined}
                                                            borderLeft={isSelected ? "3px solid" : undefined}
                                                            borderLeftColor={isSelected ? "blue.400" : undefined}
                                                        >
                                                            <Td>{device.deviceNo}</Td>

                                                            <Td fontWeight="medium">
                                                                {device.deviceName}
                                                            </Td>

                                                            <Td>
                                                                {device.deviceType}
                                                            </Td>

                                                            <Td>
                                                                {device.shiftType}
                                                            </Td>

                                                            <Td>
                                                                <Flex
                                                                    align="center"
                                                                    gap={2}
                                                                >
                                                                    <Switch
                                                                        colorScheme="green"
                                                                        isChecked={isActive}
                                                                        onChange={() =>
                                                                            handleActiveToggle(
                                                                                division.divisionName,
                                                                                device.deviceNo
                                                                            )
                                                                        }
                                                                    />

                                                                    <Text
                                                                        fontSize="xs"
                                                                        fontWeight="semibold"
                                                                        color={
                                                                            isActive
                                                                                ? "green.600"
                                                                                : "red.500"
                                                                        }
                                                                        minW="52px"
                                                                    >
                                                                        {isActive
                                                                            ? "Enabled"
                                                                            : "Disabled"}
                                                                    </Text>
                                                                </Flex>
                                                            </Td>

                                                            <Td>
                                                                <Flex
                                                                    align="center"
                                                                    gap={2}
                                                                >
                                                                    <Switch
                                                                        colorScheme="green"
                                                                        isChecked={
                                                                            isReportEnabled
                                                                        }
                                                                        onChange={() =>
                                                                            handleReportToggle(
                                                                                division.divisionName,
                                                                                device.deviceNo
                                                                            )
                                                                        }
                                                                    />

                                                                    <Text
                                                                        fontSize="xs"
                                                                        fontWeight="semibold"
                                                                        color={
                                                                            isReportEnabled
                                                                                ? "green.600"
                                                                                : "red.500"
                                                                        }
                                                                    >
                                                                        {isReportEnabled
                                                                            ? "Enabled"
                                                                            : "Disabled"}
                                                                    </Text>
                                                                </Flex>
                                                            </Td>

                                                            <Td isNumeric>
                                                                {
                                                                    device.reportDistMargin
                                                                }
                                                            </Td>

                                                            <Td isNumeric>
                                                                {
                                                                    device.reportTimeMargin
                                                                }
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    {totalPages > 1 && (
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            p={4}
                                            borderTop="1px solid"
                                            borderColor="gray.200"
                                        >
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                Showing{" "}
                                                {(currentPage - 1) *
                                                    pageSize +
                                                    1}
                                                -
                                                {Math.min(
                                                    currentPage *
                                                    pageSize,
                                                    division.devices.length
                                                )}{" "}
                                                of{" "}
                                                {
                                                    division.devices
                                                        .length
                                                }{" "}
                                                devices
                                            </Text>

                                            <Flex gap={2}>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setDivisionPage(
                                                            currentPage -
                                                            1
                                                        )
                                                    }
                                                    isDisabled={
                                                        currentPage ===
                                                        1
                                                    }
                                                >
                                                    Previous
                                                </Button>

                                                <Text
                                                    alignSelf="center"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                >
                                                    Page {currentPage} of{" "}
                                                    {totalPages}
                                                </Text>

                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setDivisionPage(
                                                            currentPage +
                                                            1
                                                        )
                                                    }
                                                    isDisabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                >
                                                    Next
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    )}

                                </>
                            );
                        })()}
                    </Box>
                ))}
            </Box>
        );
    });
