import {
    Badge,
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

import { TripReportStatus } from "../../data/reportLogSchema";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: TripReportStatus[];
}

export const TripListModal = ({
    isOpen,
    onClose,
    data,
}: Props) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="6xl"
        >

            <ModalOverlay />

            <ModalContent>

                <ModalHeader>
                    Trip Details
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody pb={6}>

                    <Box overflowX="auto">

                        <Table size="sm">

                            <Thead bg="gray.100">

                                <Tr>

                                    <Th>
                                        Trip No
                                    </Th>

                                    <Th>
                                        Start Time
                                    </Th>

                                    <Th>
                                        End Time
                                    </Th>

                                    <Th>
                                        Distance
                                    </Th>

                                    <Th>
                                        Max Speed
                                    </Th>

                                    <Th>
                                        Avg Speed
                                    </Th>

                                    <Th>
                                        Remark
                                    </Th>

                                </Tr>

                            </Thead>

                            <Tbody>

                                {data.map(
                                    (
                                        trip,
                                        index
                                    ) => (

                                        <Tr
                                            key={index}
                                        >

                                            <Td>
                                                {
                                                    trip.tripNo
                                                }
                                            </Td>

                                            <Td>
                                                {
                                                    trip.tripStartTime
                                                }
                                            </Td>

                                            <Td>
                                                {
                                                    trip.tripEndTime
                                                }
                                            </Td>

                                            <Td>
                                                {
                                                    trip.distanceCoverTrip
                                                }
                                            </Td>

                                            <Td>
                                                {
                                                    trip.tripMaxSpeed
                                                }
                                            </Td>

                                            <Td>
                                                {
                                                    trip.tripAvgSpeed
                                                }
                                            </Td>

                                            <Td>

                                                <Badge
                                                    colorScheme="orange"
                                                >
                                                    {
                                                        trip.remark
                                                    }
                                                </Badge>

                                            </Td>

                                        </Tr>

                                    )
                                )}

                            </Tbody>

                        </Table>

                    </Box>

                </ModalBody>

            </ModalContent>

        </Modal>
    );
};