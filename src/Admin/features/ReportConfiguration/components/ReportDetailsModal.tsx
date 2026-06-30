// ReportDetailsModal.tsx

import { useState } from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Box,
    IconButton,
} from "@chakra-ui/react";

import {
    FiMenu,
    FiX,
} from "react-icons/fi";

import { ReportTabType } from "../data/schema";
import { ReportLogView } from "../features/report_log_view/ReportLogView";
import { ReportDeviceConfigView } from "../features/report_device_config/ReportDeviceConfigView";
import { ReportModalSidebar } from "./report_modal/ReportModalSideBar";
import { ReportConfigDashboard } from "../features/report_config_dashboard/ReportConfigDashboard";
import { ReportModuleView } from "../features/report_module/ReportModuleView";

interface Props {
    open: boolean;
    onClose: () => void;
    divisionName: string;
    divisionId: string;
}

export const ReportDetailsModal = ({
    open,
    onClose,
    divisionName,
    divisionId,
}: Props) => {

    const [activeTab, setActiveTab] =
        useState<ReportTabType>("DASHBOARD");

    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    const renderContent = () => {

        switch (activeTab) {

            case "DASHBOARD":
                return (
                    <ReportConfigDashboard />
                );

            case "REPORT_LOG":
                return (
                    <ReportLogView
                        divisionId={divisionId}
                    />
                );

            case "REPORT_MODULE":
                return (
                    <ReportModuleView divisionId={divisionId} />
                );

            case "DEVICE_CONFIG":
                return (
                    <ReportDeviceConfigView
                        divisionId={divisionId}
                    />
                );

            case "TRIP_CONFIG":
                return (
                    <ReportDeviceConfigView
                        divisionId={divisionId}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            size="full"
        >

            <ModalOverlay />

            <ModalContent>

                <ModalHeader
                    borderBottom="1px solid"
                    borderColor="gray.200"
                >

                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                    >

                        <Flex
                            alignItems="center"
                            gap={3}
                        >

                            <IconButton
                                aria-label="Toggle Sidebar"
                                icon={
                                    sidebarOpen
                                        ? <FiX />
                                        : <FiMenu />
                                }
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    setSidebarOpen(
                                        !sidebarOpen
                                    )
                                }
                            />

                            <Box
                                fontWeight="700"
                            >
                                {divisionName}
                            </Box>

                        </Flex>

                    </Flex>

                </ModalHeader>

                <ModalCloseButton />

                <ModalBody p={0}>

                    <Flex h="calc(100vh - 80px)">

                        {/* Sidebar */}
                        {
                            sidebarOpen && (
                                <Box
                                    w="280px"
                                    borderRight="1px solid"
                                    borderColor="gray.200"
                                    bg="white"
                                    transition="0.2s"
                                >

                                    <ReportModalSidebar
                                        activeTab={activeTab}
                                        onChangeTab={setActiveTab}
                                    />

                                </Box>
                            )
                        }

                        {/* Content */}
                        <Box
                            flex={1}
                            p={5}
                            overflowY="auto"
                            bg="gray.50"
                            transition="0.2s"
                        >

                            {renderContent()}

                        </Box>

                    </Flex>

                </ModalBody>

            </ModalContent>

        </Modal>
    );
};