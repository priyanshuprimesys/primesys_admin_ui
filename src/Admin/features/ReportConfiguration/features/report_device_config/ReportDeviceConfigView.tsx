import { Badge, Box, Button, Divider, Flex, Input, Select, Text } from "@chakra-ui/react";
import { forwardRef, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { useDeviceReportConfig, useUpdateDeviceReportStatus } from "./data/queryOptions";
import { DeviceReportConfig, ReportDeviceConfigStatus } from "./data/schema";
import { ReportDeviceConfigTable, ReportDeviceConfigTableHandle } from "./components/ReportDeviceConfigTable";

interface Props {
    divisionId: string;
}

export const ReportDeviceConfigView = forwardRef<ReportDeviceConfigTableHandle, Props>(({ divisionId }, ref) => {
    const [deviceTypeId, setDeviceTypeId] = useState<string>("");
    const [deviceSearch, setDeviceSearch] = useState<string>("");
    const [matchedDevices, setMatchedDevices] = useState<{ divisionName: string; device: DeviceReportConfig }[]>([]);
    const [queryVars, setQueryVars] = useState<{ divisionId: string; deviceTypeId: number }>({
        divisionId: "",
        deviceTypeId: 0,
    });
    const { deviceType } = useContext(DeviceTypeContext);
    const { data, isLoading } = useDeviceReportConfig(queryVars.divisionId, queryVars.deviceTypeId);
    const { mutate: updateDeviceStatus, isPending: isUpdating } = useUpdateDeviceReportStatus();

    const handleLoadConfig = () => {
        if (divisionId && deviceTypeId) {
            setQueryVars({ divisionId, deviceTypeId: parseInt(deviceTypeId) });
        }
    };

    const handleDeviceSearch = () => {
        const deviceNos = deviceSearch
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);

        if (!deviceNos.length) return;

        if (!data?.data.result.length) {
            toast.error("Load the report config first.");
            return;
        }

        const searchSet = new Set(deviceNos);
        const found: { divisionName: string; device: DeviceReportConfig }[] = [];

        data.data.result.forEach((division) => {
            division.devices.forEach((device) => {
                if (searchSet.has(device.deviceNo)) {
                    found.push({ divisionName: division.divisionName, device });
                }
            });
        });

        const notFoundNos = deviceNos.filter((n) => !found.some((f) => f.device.deviceNo === n));
        if (notFoundNos.length) {
            toast.error(`Not in list: ${notFoundNos.join(", ")}`);
        }

        if (found.length) {
            setMatchedDevices(found);
        } else {
            toast.error("No matching devices found in the loaded config.");
            setMatchedDevices([]);
        }
    };

    const handleBulkAction = (activeStatus: boolean | null, reportEnable: boolean | null) => {
        if (!matchedDevices.length) return;

        const payload: ReportDeviceConfigStatus = {
            divisionId,
            deviceTypeId: queryVars.deviceTypeId,
            devices: matchedDevices.map(({ device: d }) => ({
                devices: String(d.deviceNo),
                activeStatus: activeStatus !== null ? activeStatus : d.activeStatus,
                reportEnable: reportEnable !== null ? reportEnable : d.reportEnable,
            })),
        };

        updateDeviceStatus(payload, {
            onSuccess: () => {
                setMatchedDevices([]);
                setDeviceSearch("");
            },
        });
    };

    return (
        <>
            <Flex justify="space-between" align="end" gap={6} wrap="wrap">
                {/* Device Type Selection */}
                <Flex align="end" gap={3}>
                    <Box minW="250px">
                        <Text mb={1}>Device Type</Text>
                        <Select
                            placeholder="Select Device Type"
                            value={deviceTypeId}
                            onChange={(e) => setDeviceTypeId(e.target.value)}
                        >
                            {deviceType?.data.result.map((device) => (
                                <option key={device.deviceTypeId} value={device.deviceTypeId}>
                                    {device.deviceType}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Button colorScheme="blue" onClick={handleLoadConfig} isDisabled={!deviceTypeId}>
                        Get Division Report
                    </Button>
                </Flex>

                {/* Device Search */}
                <Flex align="end" gap={3}>
                    <Box minW="350px">
                        <Text mb={1}>Devices</Text>
                        <Input
                            placeholder="1,2,3,4,5..."
                            value={deviceSearch}
                            onChange={(e) => setDeviceSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleDeviceSearch()}
                        />
                    </Box>
                    <Button
                        colorScheme="teal"
                        onClick={handleDeviceSearch}
                        isDisabled={!deviceSearch.trim()}
                    >
                        Select Devices
                    </Button>
                </Flex>
            </Flex>

            {/* Action bar — shown when devices are matched by search */}
            {matchedDevices.length > 0 && (
                <Flex
                    mt={4}
                    px={4}
                    py={3}
                    bg="blue.50"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="blue.200"
                    align="center"
                    gap={3}
                    wrap="wrap"
                >
                    <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                        {matchedDevices.length} device{matchedDevices.length !== 1 ? "s" : ""} selected
                    </Badge>

                    <Divider orientation="vertical" h="24px" borderColor="blue.300" />

                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">Device:</Text>
                    <Button size="sm" colorScheme="green" isLoading={isUpdating} onClick={() => handleBulkAction(true, null)}>
                        Enable
                    </Button>
                    <Button size="sm" colorScheme="red" variant="outline" isLoading={isUpdating} onClick={() => handleBulkAction(false, null)}>
                        Disable
                    </Button>

                    <Divider orientation="vertical" h="24px" borderColor="blue.300" />

                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">Report:</Text>
                    <Button size="sm" colorScheme="blue" isLoading={isUpdating} onClick={() => handleBulkAction(null, true)}>
                        Enable
                    </Button>
                    <Button size="sm" colorScheme="orange" variant="outline" isLoading={isUpdating} onClick={() => handleBulkAction(null, false)}>
                        Disable
                    </Button>

                    <Button size="sm" variant="ghost" ml="auto" onClick={() => { setMatchedDevices([]); setDeviceSearch(""); }}>
                        Clear
                    </Button>
                </Flex>
            )}

            <ReportDeviceConfigTable
                ref={ref}
                isLoading={isLoading}
                data={data?.data.result ?? []}
                divisionId={divisionId}
                selectedDeviceNos={matchedDevices.map((m) => m.device.deviceNo)}
            />
        </>
    );
});
