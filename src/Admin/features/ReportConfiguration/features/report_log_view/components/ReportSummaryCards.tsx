import {
    Box,
    Flex,
    Grid,
    Text,
} from "@chakra-ui/react";

interface Props {
    remarkSummary: {
        name: string;
        count: number;
    }[];

    selectedRemark: string;

    setSelectedRemark: (
        value: string
    ) => void;

    setCurrentPage: (
        value: number
    ) => void;
}

export const ReportSummaryCards = ({
    remarkSummary,
    selectedRemark,
    setSelectedRemark,
    setCurrentPage,
}: Props) => {

    return (

        <Grid
            templateColumns="
                repeat(auto-fit,minmax(220px,1fr))
            "
            gap={4}
            mb={6}
        >

            {remarkSummary.map(
                (
                    item,
                    summaryIndex
                ) => {

                    const isActive =
                        selectedRemark ===
                        item.name;

                    return (

                        <Box
                            key={summaryIndex}
                            bg="white"
                            borderRadius="14px"
                            border="2px solid"
                            borderColor={
                                isActive
                                    ? "teal.400"
                                    : "gray.200"
                            }
                            p={4}
                            cursor="pointer"
                            transition="0.2s"
                            _hover={{
                                shadow: "sm",
                                transform:
                                    "translateY(-2px)",
                            }}
                            onClick={() => {

                                setSelectedRemark(
                                    item.name
                                );

                                setCurrentPage(1);

                            }}
                        >

                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                gap={4}
                            >

                                <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    fontWeight="500"
                                >
                                    {item.name}
                                </Text>

                                <Text
                                    fontSize="2xl"
                                    fontWeight="700"
                                    color={
                                        item.count > 0
                                            ? "teal.500"
                                            : "gray.400"
                                    }
                                >
                                    {item.count}
                                </Text>

                            </Flex>

                        </Box>

                    );
                }
            )}

        </Grid>
    );
};