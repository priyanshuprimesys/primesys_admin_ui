import {
    Badge,
    Box,
    Button,
    Circle,
    Flex,
    Grid,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Progress,
    Select,
    Skeleton,
    Stack,
    Switch,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";

import { IoSearch } from "react-icons/io5";
import { TbPackages, TbPackage, TbPackageOff } from "react-icons/tb";
import { MdOutlineAccountTree } from "react-icons/md";
import { LuChevronsUpDown, LuChevronUp, LuChevronDown } from "react-icons/lu";

import { useEffect, useMemo, useState } from "react";
import { useFetchReportModules, useUpdateReportModules } from "./data/queryOptions";
import { ReportModule, ReportSubModule } from "./data/schema";

const PAGE_SIZE = 10;

type SortField = "moduleName" | "displayName" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "inactive";

/* ─── Stat Card ─────────────────────────────────────────── */

interface StatCardProps {
    label: string;
    value: number;
    accentColor: string;
    icon: React.ReactNode;
    progress?: number;
}

const StatCard = ({ label, value, accentColor, icon, progress }: StatCardProps) => (
    <Box
        bg="white"
        borderRadius="10px"
        border="1px solid"
        borderColor="gray.100"
        p={4}
        position="relative"
        overflow="hidden"
        _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: "100%",
            bg: accentColor,
            borderRadius: "10px 0 0 10px",
        }}
    >
        <Flex justifyContent="space-between" alignItems="center">
            <Box>
                <Text
                    fontSize="10px"
                    color="gray.400"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    mb={1}
                >
                    {label}
                </Text>
                <Text fontSize="xl" fontWeight="800" color="gray.800" lineHeight="1">
                    {value}
                </Text>
            </Box>
            <Circle size="34px" bg={`${accentColor}18`}>
                <Box color={accentColor} fontSize="16px" display="flex" alignItems="center">
                    {icon}
                </Box>
            </Circle>
        </Flex>
        {progress !== undefined && (
            <Box mt={3}>
                <Progress value={progress} size="xs" colorScheme="green" borderRadius="full" bg="gray.100" />
            </Box>
        )}
    </Box>
);

/* ─── Sort Icon ──────────────────────────────────────────── */

const SortIcon = ({ field, active, dir }: { field: string; active: SortField | null; dir: SortDir }) => {
    if (active !== field) return <LuChevronsUpDown style={{ opacity: 0.35, fontSize: "11px" }} />;
    return dir === "asc"
        ? <LuChevronUp style={{ fontSize: "11px" }} />
        : <LuChevronDown style={{ fontSize: "11px" }} />;
};

/* ─── Loading Skeleton ───────────────────────────────────── */

const TableSkeleton = () => (
    <Stack spacing={0}>
        {Array.from({ length: 7 }).map((_, i) => (
            <Flex
                key={i}
                px={5}
                py={3}
                borderBottom="1px solid"
                borderColor="gray.100"
                gap={4}
                bg={i % 2 === 0 ? "white" : "gray.50"}
                alignItems="center"
            >
                <Skeleton height="14px" w="24px" borderRadius="md" />
                <Skeleton height="14px" flex={2} borderRadius="md" />
                <Skeleton height="14px" flex={2} borderRadius="md" />
                <Skeleton height="14px" w="60px" borderRadius="full" />
                <Skeleton height="14px" w="80px" borderRadius="full" />
                <Skeleton height="20px" w="36px" borderRadius="full" />
            </Flex>
        ))}
    </Stack>
);

/* ─── Pagination ─────────────────────────────────────────── */

const Pagination = ({
    current,
    total,
    onChange,
}: {
    current: number;
    total: number;
    onChange: (page: number) => void;
}) => {
    const pages = useMemo(() => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
        if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
        return [1, "…", current - 1, current, current + 1, "…", total];
    }, [current, total]);

    return (
        <Flex gap={1} alignItems="center">
            <Button
                size="sm"
                variant="ghost"
                borderRadius="8px"
                isDisabled={current === 1}
                onClick={() => onChange(current - 1)}
                fontSize="xs"
                color="gray.600"
                px={3}
            >
                ← Prev
            </Button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <Text key={i} px={1} color="gray.400" fontSize="sm">…</Text>
                ) : (
                    <Button
                        key={i}
                        size="sm"
                        borderRadius="8px"
                        onClick={() => onChange(p as number)}
                        bg={current === p ? "blue.500" : "transparent"}
                        color={current === p ? "white" : "gray.600"}
                        _hover={{ bg: current === p ? "blue.600" : "gray.100" }}
                        variant="unstyled"
                        fontSize="xs"
                        minW="30px"
                        h="30px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {p}
                    </Button>
                )
            )}

            <Button
                size="sm"
                variant="ghost"
                borderRadius="8px"
                isDisabled={current === total}
                onClick={() => onChange(current + 1)}
                fontSize="xs"
                color="gray.600"
                px={3}
            >
                Next →
            </Button>
        </Flex>
    );
};

/* ─── Main Component ─────────────────────────────────────── */

export const ReportModuleView = ({ divisionId }: { divisionId: string }) => {

    const { data, isSuccess, isLoading, isFetching } = useFetchReportModules(divisionId);
    const { mutate, isPending } = useUpdateReportModules();

    const [moduleList, setModuleList] = useState<ReportModule[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedModule, setSelectedModule] = useState<ReportModule | null>(null);

    useEffect(() => {
        if (isSuccess && data) {
            setModuleList(data.data.result);
        }
    }, [data, isSuccess]);

    /* ── Summary stats ── */
    const summary = useMemo(() => {
        const total = moduleList.length;
        const active = moduleList.filter(m => m.status).length;
        const inactive = total - active;
        const withSubModules = moduleList.filter(m => (m.subModules?.length ?? 0) > 0).length;
        const activeRatio = total > 0 ? (active / total) * 100 : 0;
        return { total, active, inactive, withSubModules, activeRatio };
    }, [moduleList]);

    /* ── Filtered + sorted + paginated ── */
    const filtered = useMemo(() => {
        let list = moduleList;

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                m => m.moduleName.toLowerCase().includes(q) || m.displayName.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== "all") {
            list = list.filter(m => (statusFilter === "active" ? m.status : !m.status));
        }

        if (sortField) {
            list = [...list].sort((a, b) => {
                let av: string | boolean = a[sortField];
                let bv: string | boolean = b[sortField];
                if (typeof av === "boolean") {
                    return sortDir === "asc" ? (av === bv ? 0 : av ? -1 : 1) : (av === bv ? 0 : av ? 1 : -1);
                }
                const cmp = (av as string).localeCompare(bv as string);
                return sortDir === "asc" ? cmp : -cmp;
            });
        }

        return list;
    }, [moduleList, search, statusFilter, sortField, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (value: StatusFilter) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleToggle = (id: string, checked: boolean) => {
        const updated = moduleList.map(m => m.id === id ? { ...m, status: checked } : m);
        setModuleList(updated);
        const activeIds = updated.filter(m => m.status).map(m => m.id);
        mutate({ divisionId, moduleList: activeIds });
    };

    const handleOpenSubModules = (module: ReportModule) => {
        setSelectedModule(module);
        onOpen();
    };

    /* ─── Render ─────────────────────────────────────────── */

    return (
        <>
            {/* ── Stat Cards ── */}
            <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={3} mb={5}>
                <StatCard
                    label="Total Modules"
                    value={summary.total}
                    accentColor="#3B82F6"
                    icon={<TbPackages />}
                />
                <StatCard
                    label="Active"
                    value={summary.active}
                    accentColor="#22C55E"
                    icon={<TbPackage />}
                    progress={summary.activeRatio}
                />
                <StatCard
                    label="Inactive"
                    value={summary.inactive}
                    accentColor="#EF4444"
                    icon={<TbPackageOff />}
                />
                <StatCard
                    label="With Submodules"
                    value={summary.withSubModules}
                    accentColor="#8B5CF6"
                    icon={<MdOutlineAccountTree />}
                />
            </Grid>

            {/* ── Table Card ── */}
            <Box
                bg="white"
                borderRadius="12px"
                border="1px solid"
                borderColor="gray.150"
                overflow="hidden"
                boxShadow="0 1px 6px rgba(0,0,0,0.05)"
            >
                {/* ── Toolbar ── */}
                <Flex
                    px={5}
                    py={3.5}
                    justifyContent="space-between"
                    alignItems="center"
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    flexWrap="wrap"
                    gap={3}
                >
                    <Flex alignItems="center" gap={2.5}>
                        <Text fontWeight="700" fontSize="sm" color="gray.700">
                            Report Modules
                        </Text>
                        <Badge
                            bg="blue.50"
                            color="blue.600"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="10px"
                            fontWeight="700"
                        >
                            {filtered.length}
                        </Badge>
                        {isFetching && !isLoading && (
                            <Text fontSize="10px" color="gray.400" fontStyle="italic">syncing…</Text>
                        )}
                    </Flex>

                    <Flex gap={2}>
                        <InputGroup size="sm" maxW="200px">
                            <InputLeftElement pointerEvents="none" color="gray.400" fontSize="13px">
                                <IoSearch />
                            </InputLeftElement>
                            <Input
                                placeholder="Search modules…"
                                value={search}
                                onChange={e => handleSearchChange(e.target.value)}
                                borderRadius="8px"
                                fontSize="sm"
                                bg="white"
                                borderColor="gray.200"
                                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63B3ED" }}
                            />
                        </InputGroup>

                        <Select
                            size="sm"
                            value={statusFilter}
                            onChange={e => handleStatusFilterChange(e.target.value as StatusFilter)}
                            borderRadius="8px"
                            fontSize="sm"
                            maxW="130px"
                            bg="white"
                            borderColor="gray.200"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </Flex>
                </Flex>

                {/* ── Table ── */}
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <Box overflowX="auto">
                        <Table variant="unstyled" size="sm" style={{ borderCollapse: "collapse" }}>
                            <Thead>
                                <Tr>
                                    <Th
                                        py={3}
                                        px={5}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        w="44px"
                                    >
                                        #
                                    </Th>
                                    <Th
                                        py={3}
                                        px={3}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() => handleSort("moduleName")}
                                        _hover={{ color: "gray.700" }}
                                    >
                                        <Flex alignItems="center" gap={1}>
                                            Module Name
                                            <SortIcon field="moduleName" active={sortField} dir={sortDir} />
                                        </Flex>
                                    </Th>
                                    <Th
                                        py={3}
                                        px={3}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() => handleSort("displayName")}
                                        _hover={{ color: "gray.700" }}
                                    >
                                        <Flex alignItems="center" gap={1}>
                                            Display Name
                                            <SortIcon field="displayName" active={sortField} dir={sortDir} />
                                        </Flex>
                                    </Th>
                                    <Th
                                        py={3}
                                        px={3}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() => handleSort("status")}
                                        _hover={{ color: "gray.700" }}
                                        w="100px"
                                    >
                                        <Flex alignItems="center" gap={1}>
                                            Status
                                            <SortIcon field="status" active={sortField} dir={sortDir} />
                                        </Flex>
                                    </Th>
                                    <Th
                                        py={3}
                                        px={3}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        w="130px"
                                    >
                                        Submodules
                                    </Th>
                                    <Th
                                        py={3}
                                        px={5}
                                        bg="white"
                                        borderBottom="2px solid"
                                        borderColor="gray.100"
                                        color="gray.500"
                                        fontWeight="600"
                                        fontSize="10px"
                                        letterSpacing="0.08em"
                                        textTransform="uppercase"
                                        w="80px"
                                        textAlign="center"
                                    >
                                        Enable
                                    </Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {paginated.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={6} px={5} py={0}>
                                            <Flex
                                                direction="column"
                                                alignItems="center"
                                                py={14}
                                                gap={3}
                                            >
                                                <Box
                                                    w="48px"
                                                    h="48px"
                                                    borderRadius="full"
                                                    bg="gray.100"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    color="gray.400"
                                                    fontSize="22px"
                                                >
                                                    <TbPackages />
                                                </Box>
                                                <Box textAlign="center">
                                                    <Text fontSize="sm" fontWeight="600" color="gray.500">
                                                        No modules found
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400" mt={0.5}>
                                                        Try adjusting your search or filter
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ) : (
                                    paginated.map((module, idx) => {
                                        const rowNum = (safePage - 1) * PAGE_SIZE + idx + 1;
                                        const subCount = module.subModules?.length ?? 0;
                                        const isEven = idx % 2 === 0;

                                        return (
                                            <Tr
                                                key={module.id}
                                                bg={isEven ? "white" : "gray.50"}
                                                _hover={{ bg: "blue.50" }}
                                                transition="background 0.12s"
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                            >
                                                {/* # */}
                                                <Td py={3.5} px={5} w="44px">
                                                    <Text
                                                        fontSize="11px"
                                                        fontWeight="600"
                                                        color="gray.400"
                                                        textAlign="center"
                                                    >
                                                        {rowNum}
                                                    </Text>
                                                </Td>

                                                {/* Module Name */}
                                                <Td
                                                    py={3.5}
                                                    px={3}
                                                    borderLeft="3px solid"
                                                    borderColor={module.status ? "green.300" : "red.200"}
                                                >
                                                    <Text fontWeight="600" fontSize="sm" color="gray.800">
                                                        {module.moduleName}
                                                    </Text>
                                                </Td>

                                                {/* Display Name */}
                                                <Td py={3.5} px={3}>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {module.displayName}
                                                    </Text>
                                                </Td>

                                                {/* Status */}
                                                <Td py={3.5} px={3} w="100px">
                                                    <Flex alignItems="center" gap={1.5}>
                                                        <Box
                                                            w="7px"
                                                            h="7px"
                                                            borderRadius="full"
                                                            bg={module.status ? "green.400" : "red.400"}
                                                            flexShrink={0}
                                                        />
                                                        <Text
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            color={module.status ? "green.700" : "red.600"}
                                                        >
                                                            {module.status ? "Active" : "Inactive"}
                                                        </Text>
                                                    </Flex>
                                                </Td>

                                                {/* Submodules */}
                                                <Td py={3.5} px={3} w="130px">
                                                    {subCount > 0 ? (
                                                        <Flex
                                                            as="button"
                                                            alignItems="center"
                                                            gap={1.5}
                                                            px={2.5}
                                                            py={1}
                                                            borderRadius="full"
                                                            bg="purple.50"
                                                            border="1px solid"
                                                            borderColor="purple.200"
                                                            color="purple.700"
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            cursor="pointer"
                                                            _hover={{ bg: "purple.100" }}
                                                            transition="background 0.12s"
                                                            onClick={() => handleOpenSubModules(module)}
                                                            display="inline-flex"
                                                        >
                                                            <MdOutlineAccountTree />
                                                            {subCount} sub
                                                        </Flex>
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.300" pl={1}>—</Text>
                                                    )}
                                                </Td>

                                                {/* Enable */}
                                                <Td py={3.5} px={5} w="80px" textAlign="center">
                                                    <Flex direction="column" alignItems="center" gap={0.5}>
                                                        <Tooltip
                                                            label={module.status ? "Click to disable" : "Click to enable"}
                                                            placement="top"
                                                            hasArrow
                                                            fontSize="xs"
                                                        >
                                                            <Switch
                                                                isChecked={module.status}
                                                                colorScheme="green"
                                                                size="sm"
                                                                isDisabled={isPending}
                                                                onChange={e => handleToggle(module.id, e.target.checked)}
                                                            />
                                                        </Tooltip>
                                                        <Text
                                                            fontSize="9px"
                                                            fontWeight="700"
                                                            color={module.status ? "green.500" : "gray.400"}
                                                            letterSpacing="0.04em"
                                                        >
                                                            {module.status ? "ON" : "OFF"}
                                                        </Text>
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        );
                                    })
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                )}

                {/* ── Footer / Pagination ── */}
                {!isLoading && filtered.length > 0 && (
                    <Flex
                        px={5}
                        py={3}
                        justifyContent="space-between"
                        alignItems="center"
                        bg="gray.50"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        flexWrap="wrap"
                        gap={3}
                    >
                        <Text fontSize="xs" color="gray.500">
                            Showing{" "}
                            <Text as="span" fontWeight="700" color="gray.700">
                                {(safePage - 1) * PAGE_SIZE + 1}
                            </Text>
                            {" – "}
                            <Text as="span" fontWeight="700" color="gray.700">
                                {Math.min(safePage * PAGE_SIZE, filtered.length)}
                            </Text>
                            {" "}of{" "}
                            <Text as="span" fontWeight="700" color="gray.700">
                                {filtered.length}
                            </Text>
                            {" "}modules
                        </Text>

                        <Pagination
                            current={safePage}
                            total={totalPages}
                            onChange={setCurrentPage}
                        />
                    </Flex>
                )}
            </Box>

            {/* ── Submodule Modal ── */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
                <ModalOverlay backdropFilter="blur(3px)" bg="blackAlpha.300" />
                <ModalContent borderRadius="14px" overflow="hidden" boxShadow="0 20px 60px rgba(0,0,0,0.15)">
                    <ModalHeader
                        bg="white"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        py={3.5}
                        px={5}
                    >
                        <Flex alignItems="center" gap={2.5}>
                            <Box
                                w="30px"
                                h="30px"
                                borderRadius="8px"
                                bg="purple.50"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="purple.500"
                                fontSize="15px"
                            >
                                <MdOutlineAccountTree />
                            </Box>
                            <Box>
                                <Text fontSize="sm" fontWeight="700" color="gray.800" lineHeight="1.2">
                                    {selectedModule?.displayName}
                                </Text>
                                <Text fontSize="10px" color="gray.400" fontWeight="500" mt={0.5}>
                                    {selectedModule?.moduleName}
                                </Text>
                            </Box>
                            <Badge
                                bg="purple.50"
                                color="purple.600"
                                borderRadius="full"
                                px={2}
                                py={0.5}
                                fontSize="10px"
                                fontWeight="700"
                                ml={1}
                            >
                                {selectedModule?.subModules?.length ?? 0} submodules
                            </Badge>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton top={3} />

                    <ModalBody p={0}>
                        <Box overflowX="auto" maxH="420px" overflowY="auto">
                            <Table variant="unstyled" size="sm" style={{ borderCollapse: "collapse" }}>
                                <Thead position="sticky" top={0} zIndex={1}>
                                    <Tr>
                                        {["#", "Module Name", "Display Name", "Order", "Type ID"].map((col, i) => (
                                            <Th
                                                key={col}
                                                py={3}
                                                px={i === 0 ? 5 : 3}
                                                bg="gray.50"
                                                borderBottom="2px solid"
                                                borderColor="gray.100"
                                                color="gray.500"
                                                fontWeight="600"
                                                fontSize="10px"
                                                letterSpacing="0.08em"
                                                textTransform="uppercase"
                                                w={i === 0 ? "44px" : i === 3 ? "70px" : i === 4 ? "80px" : undefined}
                                            >
                                                {col}
                                            </Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {selectedModule?.subModules?.map((sub: ReportSubModule, i: number) => (
                                        <Tr
                                            key={sub.id ?? i}
                                            bg={i % 2 === 0 ? "white" : "gray.50"}
                                            _hover={{ bg: "purple.50" }}
                                            transition="background 0.12s"
                                            borderBottom="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Td py={3} px={5} w="44px">
                                                <Text fontSize="11px" fontWeight="600" color="gray.400" textAlign="center">
                                                    {i + 1}
                                                </Text>
                                            </Td>
                                            <Td py={3} px={3} borderLeft="3px solid" borderColor="purple.200">
                                                <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                    {sub.moduleName}
                                                </Text>
                                            </Td>
                                            <Td py={3} px={3}>
                                                <Text fontSize="sm" color="gray.500">{sub.displayName}</Text>
                                            </Td>
                                            <Td py={3} px={3} w="70px">
                                                <Flex
                                                    w="24px"
                                                    h="24px"
                                                    borderRadius="6px"
                                                    bg="gray.100"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Text fontSize="10px" fontWeight="700" color="gray.600">
                                                        {sub.displayOrder}
                                                    </Text>
                                                </Flex>
                                            </Td>
                                            <Td py={3} px={3} w="80px">
                                                <Box
                                                    display="inline-flex"
                                                    px={2}
                                                    py={0.5}
                                                    borderRadius="6px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="10px" fontWeight="700" color="gray.600" fontFamily="mono">
                                                        {sub.typeId}
                                                    </Text>
                                                </Box>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
