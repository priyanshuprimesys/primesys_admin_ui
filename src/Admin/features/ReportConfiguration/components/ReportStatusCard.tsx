import {
    Box,
    Button,
    Divider,
    Flex,
    Icon,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

import { FiActivity, FiGrid, FiSettings } from "react-icons/fi";

interface ReportStatusCardProps {
    onModulesClick: () => void;
    onReportModuleClick: () => void;
    divisionName: string;
    totalModules: number;
    reportEnabled: number;
    reportDisabled: number;
}

function StatBox({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <Box textAlign="center" py={1.5} px={2} borderRadius="md" bg="gray.50">
            <Text fontSize="16px" fontWeight="bold" color={color}>
                {value}
            </Text>
            <Text fontSize="9px" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mt={0.5}>
                {label}
            </Text>
        </Box>
    );
}

export const ReportStatusCard = ({
    onModulesClick,
    onReportModuleClick,
    divisionName,
    totalModules,
    reportEnabled,
    reportDisabled,
}: ReportStatusCardProps) => {
    return (
        <Box
            bg="white"
            borderRadius="lg"
            p={3}
            boxShadow="sm"
            border="2px solid"
            borderColor="teal.300"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "md" }}
            h="100%"
        >
            {/* Header */}
            <Flex justify="space-between" align="start" mb={3}>
                <Box flex={1} minW={0}>
                    <Text
                        fontSize="9px"
                        color="gray.500"
                        fontWeight="600"
                        textTransform="uppercase"
                        mb={1}
                    >
                        Division
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        noOfLines={2}
                    >
                        {divisionName}
                    </Text>
                </Box>

                <Flex
                    minW="36px"
                    h="36px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg="teal.100"
                    ml={2}
                >
                    <Icon as={FiActivity} boxSize={3} color="teal.500" />
                </Flex>
            </Flex>

            <Divider mb={3} />

            {/* Counts */}
            <SimpleGrid columns={3} spacing={2} mb={3}>
                <StatBox label="Modules" value={totalModules} color="purple.600" />
                <StatBox label="Enabled" value={reportEnabled} color="green.500" />
                <StatBox label="Disabled" value={reportDisabled} color="red.500" />
            </SimpleGrid>

            {/* Actions */}
            <Flex direction="column" gap={2}>
                <Button
                    leftIcon={<FiGrid />}
                    size="sm"
                    colorScheme="purple"
                    variant="solid"
                    w="full"
                    onClick={onModulesClick}
                >
                    Report Module
                </Button>
                <Button
                    leftIcon={<FiSettings />}
                    size="sm"
                    colorScheme="teal"
                    variant="solid"
                    w="full"
                    onClick={onReportModuleClick}
                >
                    Report Configuration
                </Button>
            </Flex>
        </Box>
    );
};
