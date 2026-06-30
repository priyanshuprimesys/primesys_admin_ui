import {
    Badge,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { ReportEmailResponse } from "../data/schema";
import { formatEpochDateTime } from "../../../utils/ReportConfigUitls";

interface Props {
    data: ReportEmailResponse[];
}

export const ReportEmailTable = ({ data }: Props) => {
    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <Table variant="simple" size="sm">
                <Thead className="bg-gray-50">
                    <Tr>
                        <Th className="!text-xs !font-semibold !text-gray-500">#</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Division</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Track Division ID</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Email Sent To</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Status</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Sent At</Th>
                        <Th className="!text-xs !font-semibold !text-gray-500">Description</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row, index) => (
                        <Tr
                            key={`${row.divisionId}-${index}`}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <Td className="!text-gray-400 !text-xs">{index + 1}</Td>
                            <Td>
                                <Text fontSize="sm" fontWeight="600" color="gray.800">
                                    {row.divisionName ?? "-"}
                                </Text>
                                <Text fontSize="xs" color="gray.400" mt={0.5}>
                                    {row.divisionId ?? ""}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontSize="sm" color="gray.600">
                                    {row.trackDivisionId ?? "-"}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontSize="sm" color="blue.600">
                                    {row.reportEmailLog?.emailSentTo ?? "-"}
                                </Text>
                            </Td>
                            <Td>
                                <Badge
                                    colorScheme={row.reportEmailLog?.emailSent ? "green" : "red"}
                                    borderRadius="full"
                                    px={2}
                                >
                                    {row.reportEmailLog?.emailSent ? "Sent" : "Not Sent"}
                                </Badge>
                            </Td>
                            <Td>
                                <Text fontSize="sm" color="gray.600">
                                    {formatEpochDateTime(row.reportEmailLog?.emailSentAt)}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontSize="sm" color="gray.500" maxW="200px" noOfLines={2}>
                                    {row.reportEmailLog?.description ?? "-"}
                                </Text>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    );
};
