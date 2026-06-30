import {
    Box,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";

import {
    FiFileText,
    FiSettings,
} from "react-icons/fi";
import { ReportDashboardCard } from "./ReportDashboardCard";


export const ReportDashboardOptions = () => {

    return (
        <Box mb={6}>

            <Text
                fontSize="xl"
                fontWeight="bold"
                mb={4}
                color="gray.800"
            >
                Report Management
            </Text>

            <SimpleGrid
                columns={{
                    base: 1,
                    md: 2,
                    lg: 3,
                }}
                spacing={5}
            >

                <ReportDashboardCard
                    title="Report Log"
                    description="Monitor report execution logs and history"
                    icon={FiFileText}
                    color="blue"
                />

                <ReportDashboardCard
                    title="Report Device Config"
                    description="Manage report device level configurations"
                    icon={FiSettings}
                    color="green"
                />

                {/* <ReportDashboardCard
                    title="Report Trip Config"
                    description="Configure trip wise report settings"
                    icon={FiMap}
                    color="purple"
                /> */}

            </SimpleGrid>

        </Box>
    );
};