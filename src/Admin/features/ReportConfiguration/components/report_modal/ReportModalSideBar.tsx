// ReportModalSideBar.tsx

import {
    VStack,
    Flex,
    Icon,
    Text,
} from "@chakra-ui/react";

import {
    FiFileText,
    FiSettings,
    FiMap,
    FiGrid,
} from "react-icons/fi";

import { ReportTabType } from "../../data/schema";

interface Props {
    activeTab: ReportTabType;

    onChangeTab: (
        tab: ReportTabType
    ) => void;
}

export const ReportModalSidebar = ({
    activeTab,
    onChangeTab,
}: Props) => {

    const menus = [
        {
            label: "Dashboard",
            icon: FiGrid,
            value: "DASHBOARD",
        },
        {
            label: "Report Log",
            icon: FiFileText,
            value: "REPORT_LOG",
        },
        {
            label: "Report Module",
            icon: FiGrid,
            value: "REPORT_MODULE"
        },
        {
            label: "Report Device Config",
            icon: FiSettings,
            value: "DEVICE_CONFIG",
        },
        {
            label: "Report Trip Config",
            icon: FiMap,
            value: "TRIP_CONFIG",
        },
    ];

    return (
        <VStack
            align="stretch"
            spacing={2}
            p={4}
        >

            {
                menus.map((item) => {

                    const isActive =
                        activeTab === item.value;

                    return (
                        <Flex
                            key={item.value}
                            align="center"
                            gap={3}
                            p={4}
                            borderRadius="lg"
                            cursor="pointer"
                            transition="0.2s"
                            bg={
                                isActive
                                    ? "teal.500"
                                    : "transparent"
                            }
                            color={
                                isActive
                                    ? "white"
                                    : "gray.700"
                            }
                            _hover={{
                                bg: isActive
                                    ? "teal.500"
                                    : "gray.100",
                            }}
                            onClick={() =>
                                onChangeTab(
                                    item.value as ReportTabType
                                )
                            }
                        >

                            <Icon as={item.icon} />

                            <Text
                                fontWeight="600"
                                fontSize="sm"
                            >
                                {item.label}
                            </Text>

                        </Flex>
                    );
                })
            }

        </VStack>
    );
};