import { useContext, useState } from "react";
import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { DeviceTypeSelect } from "./components/DeviceTypeSelect";
import { ReportEmailDateFilter } from "./components/ReportEmailDateFilter";
import { ReportEmailTable } from "./components/ReportEmailTable";
import { useFetchReportEmailLog, useSendReportEmail } from "./data/queryOptions";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

interface ReportEmailProps {
    divisionId: string;
}

export const ReportEmailConfig = ({ divisionId }: ReportEmailProps) => {
    const { deviceType } = useContext(DeviceTypeContext);

    const [deviceTypeId, setDeviceTypeId] = useState("");
    const [reportDate, setReportDate] = useState("");
    const [queryParams, setQueryParams] = useState({
        deviceTypeId: 0,
        reportDate: 0,
    });

    const { isLoading, isFetching, data } = useFetchReportEmailLog(
        divisionId,
        queryParams.deviceTypeId,
        queryParams.reportDate
    );

    const { mutate: sendEmail, isPending: isSending } = useSendReportEmail();

    const { userDetail } = useContext(UserDetailContext);
    const userId = userDetail.data.result.divisionId;

    const handleGetReport = () => {
        if (!deviceTypeId || !reportDate) return;
        setQueryParams({
            deviceTypeId: Number(deviceTypeId),
            reportDate: Math.floor(new Date(reportDate).setHours(0, 0, 0, 0) / 1000),
        });
    };

    const handleSendEmail = () => {
        if (!deviceTypeId || !reportDate) return;
        sendEmail({
            divisionId,
            deviceTypeId: Number(deviceTypeId),
            reportDate: Math.floor(new Date(reportDate).setHours(0, 0, 0, 0) / 1000),
            userId
        });
    };

    const rows = data?.data?.result ?? [];
    const isBusy = isLoading || isFetching;

    return (
        <Box width="100%">
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
                <DeviceTypeSelect
                    value={deviceTypeId}
                    onChange={setDeviceTypeId}
                    deviceType={deviceType}
                />
                <ReportEmailDateFilter
                    date={reportDate}
                    onDateChange={setReportDate}
                    onGetReport={handleGetReport}
                    isLoading={isBusy}
                />
                <Box flex={1} minW="180px" display="flex" alignItems="end">
                    <Button
                        width="100%"
                        colorScheme="pink"
                        leftIcon={<MdEmail />}
                        onClick={handleSendEmail}
                        isLoading={isSending}
                        isDisabled={!deviceTypeId || !reportDate}
                    >
                        Send Email
                    </Button>
                </Box>
            </Flex>

            {isBusy && (
                <Flex justifyContent="center" py={10}>
                    <Spinner size="lg" color="teal.500" />
                </Flex>
            )}

            {!isBusy && rows.length > 0 && (
                <ReportEmailTable data={rows} />
            )}

            {!isBusy && queryParams.deviceTypeId > 0 && rows.length === 0 && (
                <Flex justifyContent="center" py={10}>
                    <Text color="gray.400" fontSize="sm">No email logs found for the selected filters.</Text>
                </Flex>
            )}
        </Box>
    );
};
