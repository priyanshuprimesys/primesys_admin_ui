import { useContext, useMemo, useRef, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Select,
    Input,
    Checkbox,
    Badge,
    Icon,
    Spinner,
    Center,
    InputGroup,
    InputLeftElement,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { FiSend, FiSearch, FiRefreshCw, FiWifi } from "react-icons/fi";
import { toast } from "react-toastify";

import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import {
    useAllDevices,
    useCommandCatalog,
    useSendDeviceCommands,
} from "./data/queryOptions";
import { SEND_CHUNK_SIZE } from "./data/api";
import { DeviceCommandEntity, isDeviceConnected } from "./data/schema";

const BroadcastConnectedCommand = () => {
    const { userDetail } = useContext(UserDetailContext);
    const loginName =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (userDetail as any)?.data?.result?.userName || "admin";

    const devicesQuery = useAllDevices();
    const catalogQuery = useCommandCatalog();
    const sendCommands = useSendDeviceCommands();

    const [useCustom, setUseCustom] = useState(false);
    const [selectedCommand, setSelectedCommand] = useState("");
    const [customCommand, setCustomCommand] = useState("");
    const [search, setSearch] = useState("");
    const [selectedImeis, setSelectedImeis] = useState<Set<number>>(new Set());
    const [progress, setProgress] = useState<{ sent: number; total: number } | null>(
        null
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const connected = useMemo(
        () => (devicesQuery.data ?? []).filter(isDeviceConnected),
        [devicesQuery.data]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return connected;
        return connected.filter(
            (d) =>
                d.name?.toLowerCase().includes(q) ||
                String(d.imeiNo).includes(q) ||
                d.divisionName?.toLowerCase().includes(q) ||
                d.simNo?.includes(q)
        );
    }, [connected, search]);

    // Recipients: the explicitly selected devices, or all connected if none picked.
    const recipients = useMemo(
        () =>
            selectedImeis.size > 0
                ? connected.filter((d) => selectedImeis.has(d.imeiNo))
                : connected,
        [connected, selectedImeis]
    );

    const command = (useCustom ? customCommand : selectedCommand).trim();

    const toggleOne = (imei: number, checked: boolean) =>
        setSelectedImeis((prev) => {
            const next = new Set(prev);
            if (checked) next.add(imei);
            else next.delete(imei);
            return next;
        });

    const allFilteredSelected =
        filtered.length > 0 && filtered.every((d) => selectedImeis.has(d.imeiNo));
    const someFilteredSelected =
        filtered.some((d) => selectedImeis.has(d.imeiNo)) && !allFilteredSelected;

    const toggleAllFiltered = (checked: boolean) =>
        setSelectedImeis((prev) => {
            const next = new Set(prev);
            filtered.forEach((d) => {
                if (checked) next.add(d.imeiNo);
                else next.delete(d.imeiNo);
            });
            return next;
        });

    const handleSendClick = () => {
        if (recipients.length === 0) {
            toast.info("No devices to send to.");
            return;
        }
        if (!command) {
            toast.warn("Choose or type a command first.");
            return;
        }
        onOpen();
    };

    const handleConfirmSend = () => {
        onClose();
        const entities: DeviceCommandEntity[] = recipients.map((d) => ({
            device_imei: d.imeiNo,
            command,
            device_name: d.name,
            login_name: loginName,
            division_id: d.divisionId ?? "",
        }));
        setProgress({ sent: 0, total: entities.length });
        sendCommands.mutate(
            {
                entities,
                onProgress: (sent, total) => setProgress({ sent, total }),
            },
            {
                onSuccess: () =>
                    toast.success(
                        `Command "${command}" sent to ${entities.length} device(s).`
                    ),
                onError: (err) =>
                    toast.error(
                        (err as Error)?.message || "Failed to send command"
                    ),
                onSettled: () => setProgress(null),
            }
        );
    };

    return (
        <Box bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="xl" p={4}>
            <Flex align="center" justify="space-between" gap={2} mb={1} wrap="wrap">
                <Flex align="center" gap={2}>
                    <Icon as={FiWifi} boxSize={5} color="teal.500" />
                    <Heading size="sm">Broadcast Command to Connected Devices</Heading>
                    <Badge colorScheme="teal" borderRadius="md">
                        {connected.length} connected
                    </Badge>
                </Flex>
                <Button
                    size="xs"
                    variant="outline"
                    leftIcon={<FiRefreshCw />}
                    onClick={() => devicesQuery.refetch()}
                    isLoading={devicesQuery.isFetching}
                >
                    Refresh
                </Button>
            </Flex>
            <Text fontSize="xs" color="gray.500" mb={4}>
                Sends to every device currently connected to the server (across all
                divisions) — not division-wise.
            </Text>

            {/* Command selection */}
            <Flex gap={3} align="flex-end" wrap="wrap" mb={4}>
                <Box flex="1" minW="240px">
                    <Text fontSize="xs" fontWeight="semibold" mb={1}>
                        Command
                    </Text>
                    {useCustom ? (
                        <Input
                            size="sm"
                            placeholder="e.g. GPSON,5"
                            value={customCommand}
                            onChange={(e) => setCustomCommand(e.target.value)}
                        />
                    ) : (
                        <Select
                            size="sm"
                            placeholder={
                                catalogQuery.isLoading
                                    ? "Loading commands…"
                                    : "Select a command"
                            }
                            value={selectedCommand}
                            onChange={(e) => setSelectedCommand(e.target.value)}
                        >
                            {(catalogQuery.data ?? [])
                                .filter((c) => c.activeStatus !== false)
                                .map((c, i) => (
                                    <option key={`${c.id}-${c.command}-${i}`} value={c.command}>
                                        {c.title} ({c.command})
                                    </option>
                                ))}
                        </Select>
                    )}
                </Box>
                <Checkbox
                    size="sm"
                    isChecked={useCustom}
                    onChange={(e) => setUseCustom(e.target.checked)}
                >
                    Custom command
                </Checkbox>
                <Button
                    size="sm"
                    colorScheme="teal"
                    leftIcon={<FiSend />}
                    onClick={handleSendClick}
                    isLoading={sendCommands.isPending}
                    isDisabled={recipients.length === 0 || !command}
                    loadingText={
                        progress
                            ? `Sending ${progress.sent}/${progress.total}`
                            : "Sending"
                    }
                >
                    Send to {recipients.length}
                </Button>
            </Flex>

            {selectedImeis.size > 0 && (
                <Text fontSize="xs" color="teal.600" mb={2}>
                    Sending to {selectedImeis.size} selected device(s).{" "}
                    <Button
                        variant="link"
                        size="xs"
                        colorScheme="teal"
                        onClick={() => setSelectedImeis(new Set())}
                    >
                        Clear selection
                    </Button>{" "}
                    (clear to send to all {connected.length} connected)
                </Text>
            )}

            {/* Connected devices preview */}
            <InputGroup size="sm" mb={2} maxW="320px">
                <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                    placeholder="Search connected devices…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            {devicesQuery.isLoading ? (
                <Center py={10}>
                    <Spinner color="teal.400" />
                </Center>
            ) : devicesQuery.isError ? (
                <Center py={10}>
                    <Text color="red.500">
                        {(devicesQuery.error as Error)?.message ||
                            "Failed to load devices"}
                    </Text>
                </Center>
            ) : connected.length === 0 ? (
                <Center py={10} flexDirection="column" color="gray.400">
                    <Icon as={FiWifi} boxSize={7} mb={2} />
                    <Text fontSize="sm">No devices are currently connected.</Text>
                    <Text fontSize="xs">
                        (Connection comes from the all-devices API flag.)
                    </Text>
                </Center>
            ) : (
                <TableContainer
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    maxH="320px"
                    overflowY="auto"
                >
                    <Table size="sm" variant="simple">
                        <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
                            <Tr>
                                <Th px={2}>
                                    <Checkbox
                                        isChecked={allFilteredSelected}
                                        isIndeterminate={someFilteredSelected}
                                        onChange={(e) => toggleAllFiltered(e.target.checked)}
                                    />
                                </Th>
                                <Th>#</Th>
                                <Th>Device</Th>
                                <Th>IMEI</Th>
                                <Th>Division</Th>
                                <Th>SIM</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filtered.map((d, i) => (
                                <Tr key={d.deviceId ?? d.imeiNo} _hover={{ bg: "gray.50" }}>
                                    <Td px={2}>
                                        <Checkbox
                                            isChecked={selectedImeis.has(d.imeiNo)}
                                            onChange={(e) =>
                                                toggleOne(d.imeiNo, e.target.checked)
                                            }
                                        />
                                    </Td>
                                    <Td>{i + 1}</Td>
                                    <Td>{d.name || "—"}</Td>
                                    <Td>{d.imeiNo}</Td>
                                    <Td>
                                        <Text fontSize="xs">{d.divisionName || "—"}</Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="xs">{d.simNo || "—"}</Text>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Send command to all connected devices?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            This sends <b>{command}</b> to <b>{recipients.length}</b>{" "}
                            device(s)
                            {selectedImeis.size > 0
                                ? " (your selection)"
                                : " (all connected, across all divisions)"}
                            . It is delivered in batches of {SEND_CHUNK_SIZE} and cannot
                            be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} size="sm">
                                Cancel
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={handleConfirmSend}
                                ml={3}
                                size="sm"
                                leftIcon={<FiSend />}
                            >
                                Send to {recipients.length}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default BroadcastConnectedCommand;
