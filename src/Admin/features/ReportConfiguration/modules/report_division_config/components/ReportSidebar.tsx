import { Box, Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { sidebarItems } from "../data/sidebarItems";
import { ReportTabType } from "../../../data/schema";






export const ReportSidebar = ({ selectedTab, setSelectedTab }: { selectedTab: ReportTabType, setSelectedTab: (tab: ReportTabType) => void }) => {

    const navigate = useNavigate();

    return (
        <>
            <Box
                w="220px"
                bg="#015958"
                color="white"
                p={4}
                display={{
                    base: "none",
                    lg: "flex",
                }}
                flexDirection="column"
            >

                <Button
                    mb={6}
                    size="sm"
                    fontSize="13px"
                    bg="#008F8C"
                    _hover={{
                        bg: "#007371",
                    }}
                    color={"white"}
                    onClick={() =>
                        navigate(
                            "/admin/report_configuration"
                        )
                    }
                >
                    Back
                </Button>

                <VStack
                    spacing={2}
                    align="stretch"
                >

                    {
                        sidebarItems.map(
                            (item) => {

                                const isActive =
                                    selectedTab ===
                                    item.value;

                                return (

                                    <Flex
                                        key={item.value}
                                        align="center"
                                        gap={2}
                                        p={3}
                                        borderRadius="lg"
                                        cursor="pointer"
                                        bg={
                                            isActive
                                                ? "#008F8C"
                                                : "transparent"
                                        }
                                        _hover={{
                                            bg: "#008F8C",
                                        }}
                                        transition="0.2s"
                                        onClick={() =>
                                            setSelectedTab(
                                                item.value as ReportTabType
                                            )
                                        }
                                    >

                                        <Icon
                                            as={item.icon}
                                            fontSize="16px"
                                        />

                                        <Text
                                            fontWeight="500"
                                            fontSize="13px"
                                        >
                                            {
                                                item.label
                                            }
                                        </Text>

                                    </Flex>
                                );
                            }
                        )
                    }

                </VStack>

            </Box>

        </>
    )
}