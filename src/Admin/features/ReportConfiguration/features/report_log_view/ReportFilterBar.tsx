// components/ReportFilterBar.tsx

import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Text,
} from "@chakra-ui/react";
import { IDeviceType } from "../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";


interface Props {
    filters: any;
    setFilters: any;
    deviceType: any;
    onFetch: () => void;
    onOpenRegenerate: () => void;
}

export const ReportFilterBar = ({
    filters,
    setFilters,
    deviceType,
    onFetch,
    onOpenRegenerate,
}: Props) => {

    return (
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

            <Box
                flex={1}
                minW="250px"
            >

                <Text
                    mb={2}
                    fontWeight="600"
                    fontSize="sm"
                >
                    Report Date
                </Text>

                <Input
                    type="date"
                    value={
                        filters.reportDate
                    }
                    onChange={(e) =>
                        setFilters(
                            (
                                prev: any
                            ) => ({
                                ...prev,
                                reportDate:
                                    e
                                        .target
                                        .value,
                            })
                        )
                    }
                />

            </Box>

            <Box
                flex={1}
                minW="250px"
            >

                <Text
                    mb={2}
                    fontWeight="600"
                    fontSize="sm"
                >
                    Device Type
                </Text>

                <Select
                    placeholder="Select Device Type"
                    value={
                        filters.deviceTypeId
                    }
                    onChange={(e) =>
                        setFilters(
                            (
                                prev: any
                            ) => ({
                                ...prev,
                                deviceTypeId:
                                    e
                                        .target
                                        .value,
                            })
                        )
                    }
                >

                    {deviceType?.data?.result?.map(
                        (
                            item: IDeviceType
                        ) => (
                            <option
                                key={
                                    item.id
                                }
                                value={
                                    item.deviceTypeId
                                }
                            >
                                {
                                    item.deviceType
                                }
                            </option>
                        )
                    )}

                </Select>

            </Box>

            <Box
                flex={1}
                minW="220px"
                display="flex"
                alignItems="end"
                gap={3}
            >

                <Button
                    width="100%"
                    colorScheme="teal"
                    onClick={
                        onFetch
                    }
                >
                    Fetch Reports
                </Button>

                <Button
                    width="100%"
                    colorScheme="orange"
                    onClick={
                        onOpenRegenerate
                    }
                >
                    Regenerate Reports
                </Button>

            </Box>

        </Flex>
    );
};