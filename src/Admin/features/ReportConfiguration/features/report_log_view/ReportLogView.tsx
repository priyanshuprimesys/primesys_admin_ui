import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useContext, useState } from "react";

import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

import {
    updateStatusMutation,
    useDeleteReportLog,
    useFetchReportDivisionLog,
    useReportRegenerateLog,
} from "../../data/queryOptions";

import { useReportDivisionConfig } from "../../modules/report_division_config/context/ReportDivisionConfigContext";
import { ReportLogFilters } from "./components/ReportLogFilters";
import { ReportLogAccordion } from "./components/ReportLogAccordian";


interface Props {
    divisionId?: string;
}

/* Guard wrapper — keeps hooks unconditional in the inner component */
export const ReportLogView = ({ divisionId }: Props) => {
    if (!divisionId) return null;
    return <ReportLogViewContent divisionId={divisionId} />;
};

const ReportLogViewContent = ({ divisionId }: { divisionId: string }) => {

    const { mutate } = updateStatusMutation();
    const { mutate: regenerateMutate, isPending: isRegenerating } = useReportRegenerateLog();
    const { mutate: deleteMutate } = useDeleteReportLog();

    const { setDivisionId, setDeviceTypeId, setReportDate } = useReportDivisionConfig();
    const { deviceType } = useContext(DeviceTypeContext);

    const [filters, setFilters] = useState({
        divisionId,
        reportDate: "",
        deviceTypeId: "",
    });

    const [queryParams, setQueryParams] = useState({
        divisionId: "",
        reportDate: 0,
        deviceTypeId: 0,
    });

    const { data, isLoading, isFetching } = useFetchReportDivisionLog(
        queryParams.divisionId,
        queryParams.deviceTypeId,
        queryParams.reportDate
    );

    const reports = data?.data?.result || [];

    const handleGetLogs = () => {
        if (!filters.reportDate || !filters.deviceTypeId) return;

        const formattedDate = Math.floor(
            new Date(filters.reportDate).setHours(0, 0, 0, 0) / 1000
        );

        setDivisionId(filters.divisionId);
        setDeviceTypeId(Number(filters.deviceTypeId));
        setReportDate(formattedDate);

        setQueryParams({
            divisionId: filters.divisionId,
            deviceTypeId: Number(filters.deviceTypeId),
            reportDate: formattedDate,
        });
    };

    const handleReportUpdate = (
        e: React.ChangeEvent<HTMLInputElement>,
        reportId: string,
        status: boolean
    ) => {
        e.preventDefault();
        mutate({
            reportId,
            divisionId: queryParams.divisionId,
            deviceTypeId: queryParams.deviceTypeId,
            reportDate: queryParams.reportDate,
            status: status ? "ACTIVE" : "INACTIVE",
        });
    };

    const handleDeleteReport = (
        e: React.MouseEvent<HTMLButtonElement>,
        reportId: string
    ) => {
        e.preventDefault();
        deleteMutate({ reportId });
    };

    const handleRegenerateReport = () => {
        regenerateMutate({
            divisionId: filters.divisionId,
            deviceTypeId: Number(filters.deviceTypeId),
            reportDate: Math.floor(
                new Date(filters.reportDate).setHours(0, 0, 0, 0) / 1000
            ),
        });
    };

    return (
        <Box width="100%">
            <ReportLogFilters
                filters={filters}
                setFilters={setFilters}
                deviceType={deviceType}
                onFetchLogs={handleGetLogs}
                isRegenerating={isRegenerating}
                onRegenerate={handleRegenerateReport}
            />

            {(isLoading || isFetching) && (
                <Flex justifyContent="center" py={10}>
                    <Spinner size="lg" />
                </Flex>
            )}

            {/* Each card receives only its own report — state lives inside the card */}
            <ReportLogAccordion
                reports={reports}
                handleReportUpdate={handleReportUpdate}
                handleDeleteReport={handleDeleteReport}
            />
        </Box>
    );
};
