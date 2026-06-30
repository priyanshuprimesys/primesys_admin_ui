import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

interface Props {
    date: string;
    onDateChange: (date: string) => void;
    onGetReport: () => void;
    isLoading?: boolean;
}

export const ReportEmailDateFilter = ({ date, onDateChange, onGetReport, isLoading }: Props) => {
    return (
        <Box flex={1} minW="250px">
            <Text mb={2} fontWeight="600" fontSize="sm">
                Report Date
            </Text>
            <Flex gap={3}>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                />
                <Button
                    colorScheme="teal"
                    onClick={onGetReport}
                    isLoading={isLoading}
                    isDisabled={!date}
                    whiteSpace="nowrap"
                >
                    Get Report
                </Button>
            </Flex>
        </Box>
    );
};
