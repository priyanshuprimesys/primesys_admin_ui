
import {
    SimpleGrid,
} from "@chakra-ui/react";

import { DashboardCard } from "./DashboardCard";

interface Props {
    dashboardData: any[];
}

export const ReportDashboardCards = ({
    dashboardData,
}: Props) => {

    return (

        <SimpleGrid
            columns={{
                base: 2,
                md: 3,
                lg: 6,
            }}
            spacing={3}
            mb={4}
        >

            {
                dashboardData.map(
                    (item, index) => (

                        <DashboardCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            color={item.color}
                            progress={item.progress}
                        />

                    )
                )
            }

        </SimpleGrid>
    );
};
