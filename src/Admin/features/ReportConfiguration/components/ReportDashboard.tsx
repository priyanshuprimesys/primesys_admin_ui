import {
    useEffect,
    useMemo,
} from "react";

import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Center,
    Flex,
    useDisclosure,
} from "@chakra-ui/react";

import {
    FiCpu,
    FiCheckCircle,
    FiLayers,
    FiXCircle,
    FiAlertCircle,
    FiList,
    FiFileText,
} from "react-icons/fi";

import { useFetchReportConfig } from "../data/queryOptions";

import { ReportConfigDetail } from "../data/schema";

import { useReportConfig } from "../context/ReportConfigurationContext";

import { ReportDashboardHeader } from "./ReportDashboardHeader";

import { ReportDivisionCards } from "./ReportDivisionCards";

import { ReportDashboardCards } from "./ReportDashboardCards";
import { ReportLogView } from "../features/report_log_view/ReportLogView";
import { TripSummaryReport } from "../features/trip_summary_report/TripSummaryReport";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import { ReportEmailConfig } from "../modules/report_email_config";

export const ReportDashboard = () => {

    const { isOpen: isLogOpen, onOpen: onLogOpen, onClose: onLogClose } = useDisclosure();
    const { isOpen: isSummaryOpen, onOpen: onSummaryOpen, onClose: onSummaryClose } = useDisclosure();
    // const { isOpen: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure();
    const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();

    const {
        setReportConfigData,
        reportConfigData,
        parentId, setParentId
    } = useReportConfig();

    const {
        data,
        isLoading,
        isSuccess,
    } = useFetchReportConfig(parentId);

    useEffect(() => {

        if (
            isSuccess &&
            data?.data?.result
        ) {

            setReportConfigData(
                data.data.result
            );
        }

    }, [
        isSuccess,
        data,
    ]);


    useEffect(() => {
        if (parentId == "") {
            setReportConfigData(null);
            if (data?.success === false) {
                toast.error("No data available");
            }
        }
    }, [parentId, data]);



    const activeSubDivisions =
        useMemo(() => {

            if (
                !reportConfigData
                    ?.reportConfigDetail
            ) {

                return 0;
            }

            return reportConfigData
                .reportConfigDetail
                .filter(
                    (
                        item: ReportConfigDetail
                    ) =>
                        item.reportEnabled > 0
                ).length;

        }, [reportConfigData]);

    const totalDevices =
        reportConfigData?.totalDevices || 1;

    const dashboardData = [
        {
            title: "Total Devices",
            value: reportConfigData?.totalDevices || 0,
            icon: FiCpu,
            color: "blue",
            progress: 100,
        },
        {
            title: "Active Devices",
            value: reportConfigData?.activeDevices || 0,
            icon: FiCheckCircle,
            color: "green",
            progress: Math.floor(
                ((reportConfigData?.activeDevices || 0) / totalDevices) * 100
            ),
        },
        {
            title: "Inactive Devices",
            value: reportConfigData?.inActiveDevices || 0,
            icon: FiXCircle,
            color: "red",
            progress: Math.floor(
                ((reportConfigData?.inActiveDevices || 0) / totalDevices) * 100
            ),
        },
        {
            title: "Report Active",
            value: reportConfigData?.reportActiveDevices || 0,
            icon: FiAlertCircle,
            color: "purple",
            progress: Math.floor(
                ((reportConfigData?.reportActiveDevices || 0) / totalDevices) * 100
            ),
        },
        {
            title: "Report Disabled",
            value: reportConfigData?.reportDisabledDevices || 0,
            icon: FiXCircle,
            color: "orange",
            progress: Math.floor(
                ((reportConfigData?.reportDisabledDevices || 0) / totalDevices) * 100
            ),
        },
        {
            title: "Sub-Divisions Active",
            value: activeSubDivisions,
            icon: FiLayers,
            color: "teal",
            progress: 100,
        },
    ];

    return (
        <>
            <Box
                h="90vh"
                bg="gray.50"
                p={{
                    base: 2,
                    md: 3,
                }}
                borderRadius="xl"
                overflow="hidden"
            >
                <ReportDashboardHeader
                    setParentId={setParentId}
                />

                {
                    isLoading ? (

                        <Center h="70vh">

                            <Spinner
                                size="xl"
                                thickness="4px"
                                color="teal.400"
                            />

                        </Center>

                    ) : reportConfigData && (

                        <Flex
                            direction="column"
                            h="calc(100% - 72px)"
                        >

                            <ReportDashboardCards
                                dashboardData={dashboardData}
                            />

                            <Flex gap={3} mb={4}>
                                <Button
                                    leftIcon={<FiList />}
                                    colorScheme="teal"
                                    variant="outline"
                                    isDisabled={!parentId}
                                    onClick={onLogOpen}
                                >
                                    Report Log
                                </Button>
                                <Button
                                    leftIcon={<FiFileText />}
                                    colorScheme="purple"
                                    variant="outline"
                                    isDisabled={!parentId}
                                    onClick={onSummaryOpen}
                                >
                                    Report Summary
                                </Button>

                                {/* <Button
                                    leftIcon={<FiFileText />}
                                    colorScheme="red"
                                    variant="outline"
                                    isDisabled={!parentId}
                                    onClick={onConfigOpen}
                                >
                                    Report Configuration
                                </Button> */}

                                <Button
                                    leftIcon={<MdEmail />}
                                    colorScheme="pink"
                                    variant="outline"
                                    isDisabled={!parentId}
                                    onClick={onEmailOpen}
                                >
                                    Division Report Email
                                </Button>
                            </Flex>

                            <ReportDivisionCards
                                reportConfigData={reportConfigData}
                            />

                        </Flex>

                    )
                }

            </Box>

            <Modal isOpen={isLogOpen} onClose={onLogClose} size="full" isCentered>
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px" h="90vh">
                    <ModalHeader fontSize="md" borderBottom="1px solid" borderColor="gray.100" py={3.5}>
                        Report Log
                    </ModalHeader>
                    <ModalCloseButton top={3} />
                    <ModalBody p={4} overflowY="auto">
                        <ReportLogView divisionId={parentId} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isSummaryOpen} onClose={onSummaryClose} size="full" isCentered>
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px" h="90vh">
                    <ModalHeader fontSize="md" borderBottom="1px solid" borderColor="gray.100" py={3.5}>
                        Trip Summary Report
                    </ModalHeader>
                    <ModalCloseButton top={3} />
                    <ModalBody p={4} overflowY="auto">
                        <TripSummaryReport divisionId={parentId} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* <Modal isOpen={isConfigOpen} onClose={onConfigClose} size="full" isCentered>
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px" h="90vh">
                    <ModalHeader fontSize="md" borderBottom="1px solid" borderColor="gray.100" py={3.5}>
                        Report Configuration
                    </ModalHeader>
                    <ModalCloseButton top={3} />
                    <ModalBody p={4} overflowY="auto">
                        <ReportDivisionConfig />
                    </ModalBody>
                </ModalContent>
            </Modal> */}
            <Modal isOpen={isEmailOpen} onClose={onEmailClose} size="full" isCentered>
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="16px" h="90vh">
                    <ModalHeader fontSize="md" borderBottom="1px solid" borderColor="gray.100" py={3.5}>
                        Report Email Configuration
                    </ModalHeader>
                    <ModalCloseButton top={3} />
                    <ModalBody p={4} overflowY="auto">
                        <ReportEmailConfig divisionId={parentId} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
