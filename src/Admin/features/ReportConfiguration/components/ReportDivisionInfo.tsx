import {
    Box,
    Text,
    Flex,
    Badge,
} from "@chakra-ui/react";

interface Props {
    divisionName: string;
    divisionId: string;
    isBlocked: boolean;
    blockedUpto?: string;
}

export const ReportDivisionInfo = ({
    divisionName,
    divisionId,
    isBlocked,
    blockedUpto,
}: Props) => {

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
        >

            <Text
                fontSize="lg"
                fontWeight="bold"
                mb={4}
            >
                Detailed Information
            </Text>

            <Flex
                direction="column"
                gap={4}
            >

                <Flex justify="space-between">

                    <Text color="gray.500">
                        Division Name
                    </Text>

                    <Text fontWeight="600">
                        {divisionName}
                    </Text>

                </Flex>

                <Flex justify="space-between">

                    <Text color="gray.500">
                        Division Id
                    </Text>

                    <Text fontWeight="600">
                        {divisionId}
                    </Text>

                </Flex>

                <Flex justify="space-between">

                    <Text color="gray.500">
                        Status
                    </Text>

                    <Badge
                        colorScheme={
                            isBlocked
                                ? "red"
                                : "green"
                        }
                    >
                        {
                            isBlocked
                                ? "Blocked"
                                : "Active"
                        }
                    </Badge>

                </Flex>

                {
                    blockedUpto && (
                        <Flex justify="space-between">

                            <Text color="gray.500">
                                Blocked Upto
                            </Text>

                            <Text
                                fontWeight="600"
                                color="orange.500"
                            >
                                {blockedUpto}
                            </Text>

                        </Flex>
                    )
                }

            </Flex>

        </Box>
    );
};