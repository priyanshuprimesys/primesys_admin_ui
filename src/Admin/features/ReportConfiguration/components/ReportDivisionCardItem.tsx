import { useRef } from "react";
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";

import { ReportStatusCard } from "./ReportStatusCard";
import { ReportConfigDetail } from "../data/schema";
import { ReportModuleView } from "../features/report_module/ReportModuleView";
import { ReportDeviceConfigView } from "../features/report_device_config/ReportDeviceConfigView";
import { ReportDeviceConfigTableHandle } from "../features/report_device_config/components/ReportDeviceConfigTable";

interface Props {
    item: ReportConfigDetail;
}

export const ReportDivisionCardItem = ({ item }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isReportModuleOpen, onOpen: onReportModuleOpen, onClose: onReportModuleClose } = useDisclosure();
    const tableRef = useRef<ReportDeviceConfigTableHandle>(null);

    return (
        <>
            <Box maxW="380px" w="100%">
                <ReportStatusCard
                    onModulesClick={onOpen}
                    onReportModuleClick={onReportModuleOpen}
                    divisionName={item.name}
                    totalModules={item.totalReportModule}
                    reportEnabled={item.reportEnabled}
                    reportDisabled={item.reportDisabled}
                />
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
                <ModalOverlay />
                <ModalContent overflowY="auto" height="90vh" borderRadius="16px">
                    <ModalHeader fontSize="md" pb={1}>
                        {item.name} — Report Module
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <ReportModuleView divisionId={item.divisionId} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isReportModuleOpen} onClose={onReportModuleClose} isCentered size="6xl">
                <ModalOverlay />
                <ModalContent borderRadius="16px" display="flex" flexDirection="column" height="90vh">
                    <ModalHeader fontSize="md" pb={1} borderBottom="1px solid" borderColor="gray.100">
                        {item.name} — Report Device Configuration
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody overflowY="auto" flex={1} pb={2}>
                        <ReportDeviceConfigView ref={tableRef} divisionId={item.divisionId} />
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="gray.100">
                        <Button variant="ghost" mr={3} onClick={onReportModuleClose}>
                            Close
                        </Button>
                        <Button colorScheme="blue" onClick={() => tableRef.current?.updateAll()}>
                            Update Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
