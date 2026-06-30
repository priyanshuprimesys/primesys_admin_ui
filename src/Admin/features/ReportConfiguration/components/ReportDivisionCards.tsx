
import {
    useState,
} from "react";

import {
    Box,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Text,
    Button,
} from "@chakra-ui/react";

import { FiFilter, FiSearch } from "react-icons/fi";

import {
    ReportConfigSummaryResult,
    ReportConfigDetail,
} from "../data/schema";

import { ReportDivisionCardItem } from "./ReportDivisionCardItem";


interface Props {
    reportConfigData: ReportConfigSummaryResult;
}

type FilterType = "all" | "inactive";

export const ReportDivisionCards = ({
    reportConfigData,
}: Props) => {

    const [filter, setFilter] = useState<FilterType>("all");
    const [search, setSearch] = useState("");

    const allItems = reportConfigData?.reportConfigDetail ?? [];

    const inactiveItems = allItems.filter(
        (item: ReportConfigDetail) => item.inActiveDevices > 0
    );

    const baseItems = filter === "inactive" ? inactiveItems : allItems;

    const filteredItems = search.trim()
        ? baseItems.filter((item: ReportConfigDetail) =>
              item.name.toLowerCase().includes(search.toLowerCase())
          )
        : baseItems;

    return (

        <Box flex={1} overflowY="auto" pr={1}>

            {/* Filter + Search row */}
            <Flex align="center" gap={2} mb={3} flexWrap="wrap">

                <Flex align="center" gap={1.5}>
                    <Icon as={FiFilter} boxSize={3.5} color="gray.400" />
                    <Text
                        fontSize="10px"
                        color="gray.400"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                    >
                        Filter
                    </Text>
                </Flex>

                <Button
                    size="xs"
                    borderRadius="full"
                    variant={filter === "all" ? "solid" : "ghost"}
                    colorScheme={filter === "all" ? "teal" : "gray"}
                    onClick={() => setFilter("all")}
                >
                    All Divisions ({allItems.length})
                </Button>

                <Button
                    size="xs"
                    borderRadius="full"
                    variant={filter === "inactive" ? "solid" : "ghost"}
                    colorScheme={filter === "inactive" ? "orange" : "gray"}
                    onClick={() => setFilter("inactive")}
                >
                    Has Inactive Devices ({inactiveItems.length})
                </Button>

                <InputGroup size="md" w="260px" ml="auto">
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" boxSize={3} />
                    </InputLeftElement>
                    <Input
                        placeholder="Search division..."
                        borderRadius="full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        focusBorderColor="black"
                        bg="white"
                        borderColor="black"
                        borderWidth="2px"
                        _hover={{ borderColor: "black" }}
                    />
                </InputGroup>

            </Flex>

            {
                filteredItems.length === 0 ? (

                    <Flex
                        justify="center"
                        align="center"
                        h="200px"
                    >

                        <Text fontSize="sm" color="gray.400">
                            {search.trim() ? "No divisions match your search" : "No divisions with inactive devices"}
                        </Text>

                    </Flex>

                ) : (

                    <SimpleGrid
                        columns={{
                            base: 1,
                            md: 2,
                            lg: 3,
                            xl: 4,
                            "2xl": 4,
                        }}
                        spacing={3}
                    >

                        {
                            filteredItems.map(
                                (item: ReportConfigDetail) => (

                                    <ReportDivisionCardItem
                                        key={item.divisionId}
                                        item={item}
                                    />

                                )
                            )
                        }

                    </SimpleGrid>

                )
            }

        </Box>
    );
};
