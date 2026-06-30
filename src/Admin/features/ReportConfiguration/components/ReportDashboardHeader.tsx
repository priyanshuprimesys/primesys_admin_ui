
import {
    Box,
    Flex,
    Text,
} from "@chakra-ui/react";

import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";

interface Props {
    setParentId: React.Dispatch<
        React.SetStateAction<string>
    >;
}

export const ReportDashboardHeader = ({
    setParentId,
}: Props) => {

    return (

        <Flex
            mb={5}
            direction={{
                base: "column",
                md: "row",
            }}
            justify="space-between"
            align={{
                base: "start",
                md: "center",
            }}
            gap={4}
        >

            <Box>

                <Text
                    fontSize={{
                        base: "lg",
                        md: "xl",
                    }}
                    fontWeight="bold"
                    color="gray.800"
                >
                    Report Configuration Dashboard
                </Text>

                <Text
                    mt={1}
                    color="gray.500"
                    fontSize="sm"
                >
                    Monitor report status and divisions
                </Text>

            </Box>

            <Box
                w={{
                    base: "100%",
                    md: "520px",
                }}
            >

                <ParentDataSearchSelect
                    placeHolder={"Search division"}
                    setInputData={setParentId}
                />

            </Box>

        </Flex>
    );
};
