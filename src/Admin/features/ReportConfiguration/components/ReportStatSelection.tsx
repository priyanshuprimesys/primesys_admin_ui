import { SimpleGrid } from "@chakra-ui/react";

import { StatBox } from "./StatBox";

interface Props {
    totalDevices: number;
    totalModules: number;
    reportEnabled: number;
    reportDisabled: number;
}

export const ReportStatsSection = ({
    totalDevices,
    totalModules,
    reportEnabled,
    reportDisabled,
}: Props) => {

    return (
        <SimpleGrid
            columns={{
                base: 1,
                md: 2,
                lg: 4,
            }}
            spacing={4}
            mb={6}
        >

            <StatBox
                label="Total Devices"
                value={totalDevices}
                color="blue.500"
            />

            <StatBox
                label="Total Modules"
                value={totalModules}
                color="purple.500"
            />

            <StatBox
                label="Report Enabled"
                value={reportEnabled}
                color="green.500"
            />

            <StatBox
                label="Report Disabled"
                value={reportDisabled}
                color="red.500"
            />

        </SimpleGrid>
    );
};