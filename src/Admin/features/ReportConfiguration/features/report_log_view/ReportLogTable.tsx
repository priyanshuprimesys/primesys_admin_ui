import {
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";

import { useState } from "react";

import {
    DivisionTripReport,
    TripReportStatus,
} from "../../data/reportLogSchema";

import { ReportTableRow } from "./ReportTableRow";

import { TripListModal } from "./TripListModal";

interface Props {
    data: DivisionTripReport[];
}

export const ReportLogTable = ({
    data,
}: Props) => {

    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

    const [
        selectedTripList,
        setSelectedTripList,
    ] = useState<TripReportStatus[]>(
        []
    );

    const handleOpenTripList = (
        tripList: TripReportStatus[]
    ) => {

        setSelectedTripList(
            tripList || []
        );

        onOpen();
    };

    return (
        <>

            <Box
                overflowX="auto"
                bg="white"
                borderRadius="16px"
                border="1px solid"
                borderColor="gray.200"
            >

                <Table size="sm">

                    <Thead bg="gray.50">

                        <Tr>

                            <Th>Device</Th>

                            <Th>IMEI</Th>

                            <Th>Section</Th>

                            <Th>Allocated</Th>

                            <Th>Actual</Th>

                            <Th>Max Speed</Th>

                            <Th>Avg Speed</Th>

                            <Th>Distance</Th>

                            <Th>Walking</Th>

                            <Th>Remark</Th>

                            <Th>Trips</Th>
                            <Th>Action</Th>

                        </Tr>

                    </Thead>

                    <Tbody>

                        {data.length === 0 && (

                            <Tr>

                                <Td
                                    colSpan={11}
                                    py={10}
                                    textAlign="center"
                                >

                                    <Text>
                                        No Reports Found
                                    </Text>

                                </Td>

                            </Tr>

                        )}

                        {data.map(
                            (
                                item,
                                index
                            ) => (

                                <ReportTableRow
                                    key={index}
                                    item={item}
                                    index={index}
                                    onOpenTrips={
                                        handleOpenTripList
                                    }
                                />

                            )
                        )}

                    </Tbody>

                </Table>

            </Box>

            <TripListModal
                isOpen={isOpen}
                onClose={onClose}
                data={selectedTripList}
            />

        </>

    );
};