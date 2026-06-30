import {
    Badge,
    Button,
    Td,
    Tr,
} from "@chakra-ui/react";
import { MdRestartAlt } from "react-icons/md";

import {
    DivisionTripReport,
    TripReportStatus,
} from "../../data/reportLogSchema";

interface Props {
    item: DivisionTripReport;
    index: number;
    onOpenTrips: (
        tripList: TripReportStatus[]
    ) => void;
}

export const ReportTableRow = ({
    item,
    index,
    onOpenTrips,
}: Props) => {

    return (
        <Tr key={index}>

            <Td>
                {item.deviceName}
            </Td>

            <Td>
                {item.deviceImei}
            </Td>

            <Td>
                {item.sectionName}
            </Td>

            <Td>
                {item.allocatedTrips}
            </Td>

            <Td>
                {item.actualTrips}
            </Td>

            <Td>
                {item.tripMaxSpeed}
            </Td>

            <Td>
                {item.tripAvgSpeed}
            </Td>

            <Td>
                {item.distanceCoverTrip}
            </Td>

            <Td>
                {item.walkingDistance}
            </Td>

            <Td>

                <Badge
                    borderRadius="md"
                    px={2}
                    py={1}
                    colorScheme={
                        item.remark
                            ?.toLowerCase()
                            ?.includes(
                                "success"
                            )
                            ? "green"
                            : "orange"
                    }
                >
                    {item.remark}
                </Badge>

            </Td>

            <Td>

                <Button
                    size="xs"
                    colorScheme="teal"
                    onClick={() =>
                        onOpenTrips(
                            item.tripList
                        )
                    }
                >
                    View Trips
                </Button>

            </Td>
            <Td>
                <Button
                    size="xs"
                    colorScheme="teal"
                    onClick={() =>
                        onOpenTrips(
                            item.tripList
                        )
                    }
                >
                    <MdRestartAlt size={23} />
                </Button>
            </Td>

        </Tr>
    );
};