import {
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    Switch,
    Text,
} from "@chakra-ui/react";

import { useMemo, useState } from "react";

import { DivisionReportLogEntity } from "../../../data/reportLogSchema";
import { formatEpochDate, formatEpochDateTime } from "../../../utils/ReportConfigUitls";
import { getFilteredReports, getRemarkSummary } from "../utils/reportFilterUitls";

import { ReportLogTable } from "../ReportLogTable";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportPagination } from "./ReportPagination";

const PAGE_SIZE = 10;

interface Props {
    report: DivisionReportLogEntity;
    handleReportUpdate: (
        e: React.ChangeEvent<HTMLInputElement>,
        reportId: string,
        status: boolean
    ) => void;
    handleDeleteReport: (
        e: React.MouseEvent<HTMLButtonElement>,
        reportId: string
    ) => void;
}

export const ReportAccordionCard = ({
    report,
    handleReportUpdate,
    handleDeleteReport
}: Props) => {

    /* Per-card state — isolated so other cards are never affected */
    const [selectedRemark, setSelectedRemark] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredReports = useMemo(
        () => getFilteredReports(report, selectedRemark),
        [report, selectedRemark]
    );

    const paginatedReports = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredReports.slice(start, start + PAGE_SIZE);
    }, [filteredReports, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));

    const remarkSummary = useMemo(
        () => getRemarkSummary(report),
        [report]
    );

    const handleRemarkChange = (remark: string) => {
        setSelectedRemark(remark);
        setCurrentPage(1);
    };

    return (
        <Box
            bg="white"
            borderRadius="16px"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
        >
            <AccordionButton
                py={5}
                px={5}
                _hover={{ bg: "gray.50" }}
                onClick={() => {
                    setSelectedRemark("All");
                    setCurrentPage(1);
                }}
            >
                <Box flex="1" textAlign="left">
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >
                        <Text fontSize="lg" fontWeight="700">
                            {formatEpochDate(report.reportDate)}
                        </Text>

                        <Badge
                            colorScheme={report.status === "ACTIVE" ? "green" : "red"}
                            px={3}
                            py={1}
                            borderRadius="md"
                        >
                            {report.status}
                        </Badge>
                    </Flex>

                    <Grid
                        templateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                        gap={3}
                        fontSize="sm"
                    >
                        <Text>
                            <b>Generated:</b>{" "}
                            {formatEpochDateTime(report.generatedAt)}
                        </Text>
                        <Text>
                            <b>Trip Lock:</b>{" "}
                            {formatEpochDateTime(report.tripLockTime)}
                        </Text>
                        <Text>
                            <b>Trip Max:</b>{" "}
                            {formatEpochDateTime(report.tripMaxTime)}
                        </Text>
                        <Text>
                            <b>Total Reports:</b>{" "}
                            {report.reports?.length}
                        </Text>
                    </Grid>
                </Box>

                <AccordionIcon />
            </AccordionButton>

            <AccordionPanel bg="gray.50" px={5} py={5}>
                <Flex justifyContent="end" mb={5}>
                    <Flex
                        alignItems="center"
                        gap={3}
                        bg="white"
                        px={4}
                        py={3}
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Badge
                            colorScheme={report.status === "ACTIVE" ? "green" : "red"}
                            px={3}
                            py={1}
                            borderRadius="md"
                        >
                            {report.status}
                        </Badge>

                        <Text fontSize="sm" fontWeight="600">Active</Text>

                        <Switch
                            isChecked={report.status === "ACTIVE"}
                            colorScheme="green"
                            onChange={(e) => handleReportUpdate(e, report.id, e.target.checked)}
                        />

                        <Button
                            size="sm"
                            colorScheme="red"
                            onClick={(e) => handleDeleteReport(e, report.id)}
                        >
                            Delete
                        </Button>
                    </Flex>
                </Flex>

                <ReportSummaryCards
                    remarkSummary={remarkSummary}
                    selectedRemark={selectedRemark}
                    setSelectedRemark={handleRemarkChange}
                    setCurrentPage={setCurrentPage}
                />

                <ReportLogTable data={paginatedReports} />

                <ReportPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </AccordionPanel>
        </Box>
    );
};
