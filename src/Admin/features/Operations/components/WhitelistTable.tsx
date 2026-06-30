import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Tag,
    Wrap,
    WrapItem,
    Badge,
    Checkbox,
    Icon,
    Tooltip,
    Button,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    useClipboard,
    useDisclosure,
} from "@chakra-ui/react";

import { FiCopy, FiCheck, FiCheckCircle } from "react-icons/fi";

import { MergedWhitelistEntry, SosContact } from "../data/schema";
import { WhitelistStatusBadge } from "./WhitelistStatusBadge";

const CompleteButton = ({
    onConfirm,
    isLoading,
    isDisabled,
}: {
    onConfirm: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="left">
            <PopoverTrigger>
                <Button
                    size="xs"
                    colorScheme="green"
                    leftIcon={<FiCheckCircle />}
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                    loadingText="Saving"
                >
                    Mark Completed
                </Button>
            </PopoverTrigger>
            <PopoverContent w="240px">
                <PopoverArrow />
                <PopoverBody>
                    <Text fontSize="sm" mb={3}>
                        Mark this device&apos;s FN &amp; SOS as completed?
                    </Text>
                    <Flex justify="flex-end" gap={2}>
                        <Button size="xs" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            size="xs"
                            colorScheme="green"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            Confirm
                        </Button>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

const formatDate = (value?: number): string => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const ContactTag = ({ contact }: { contact: SosContact }) => {
    const { hasCopied, onCopy } = useClipboard(contact.number);

    return (
        <Tag
            size="sm"
            colorScheme={contact.isAdmin ? "orange" : "blue"}
            variant={contact.isAdmin ? "solid" : "subtle"}
            borderRadius="full"
        >
            {contact.name && (
                <Text fontWeight="semibold" mr={1}>
                    {contact.name}
                </Text>
            )}
            <Text color={contact.isAdmin ? "white" : "gray.600"}>
                {contact.number}
            </Text>
            <Tooltip
                label={
                    hasCopied
                        ? "Copied"
                        : contact.isAdmin
                            ? "Admin number — Copy"
                            : "Copy"
                }
                closeOnClick={false}
            >
                {/* Box wrapper takes the Tooltip ref; react-icons don't forward refs. */}
                <Box
                    as="span"
                    display="inline-flex"
                    ml={1.5}
                    cursor="pointer"
                    aria-label={`Copy ${contact.number}`}
                    onClick={onCopy}
                    color={
                        hasCopied
                            ? "green.300"
                            : contact.isAdmin
                                ? "whiteAlpha.800"
                                : "gray.400"
                    }
                    _hover={{ color: contact.isAdmin ? "white" : "blue.500" }}
                >
                    <Icon as={hasCopied ? FiCheck : FiCopy} boxSize={3.5} />
                </Box>
            </Tooltip>
        </Tag>
    );
};

const SosContacts = ({ contacts }: { contacts: SosContact[] }) => {
    if (contacts.length === 0) {
        return (
            <Text fontSize="xs" color="gray.500">
                —
            </Text>
        );
    }

    return (
        <Wrap spacing={1.5}>
            {contacts.map((contact, idx) => (
                <WrapItem key={`${contact.number}-${idx}`}>
                    <ContactTag contact={contact} />
                </WrapItem>
            ))}
        </Wrap>
    );
};

export const WhitelistTable = ({
    entries,
    onComplete,
    completingImei,
    selectedImeis,
    onToggleSelect,
    onToggleAll,
}: {
    entries: MergedWhitelistEntry[];
    /** When provided, an Actions column with a "Mark Completed" button shows. */
    onComplete?: (deviceImei: number) => void;
    /** IMEI currently being updated (drives the per-row button spinner). */
    completingImei?: string | null;
    /** When provided, a selection checkbox column shows. */
    selectedImeis?: Set<number>;
    onToggleSelect?: (deviceImei: number, checked: boolean) => void;
    onToggleAll?: (checked: boolean) => void;
}) => {
    const selectable = !!onToggleSelect;
    const allSelected =
        selectable &&
        entries.length > 0 &&
        entries.every((e) => selectedImeis?.has(e.device_imei));
    const someSelected =
        selectable &&
        entries.some((e) => selectedImeis?.has(e.device_imei)) &&
        !allSelected;

    return (
        <TableContainer
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="lg"
            bg="white"
        >
            <Table size="sm" variant="simple">
                <Thead bg="gray.50">
                    <Tr>
                        {selectable && (
                            <Th px={2}>
                                <Checkbox
                                    isChecked={allSelected}
                                    isIndeterminate={someSelected}
                                    onChange={(e) => onToggleAll?.(e.target.checked)}
                                />
                            </Th>
                        )}
                        <Th>#</Th>
                        <Th>Device</Th>
                        <Th>Type</Th>
                        <Th>SOS Contacts</Th>
                        <Th>SIM</Th>
                        <Th>Login</Th>
                        <Th>Status</Th>
                        <Th>Created</Th>
                        {onComplete && <Th>Actions</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {entries.map((entry, index) => (
                        <Tr key={entry.id ?? index} _hover={{ bg: "gray.50" }} verticalAlign="top">
                            {selectable && (
                                <Td px={2}>
                                    <Checkbox
                                        isChecked={selectedImeis?.has(entry.device_imei)}
                                        onChange={(e) =>
                                            onToggleSelect?.(entry.device_imei, e.target.checked)
                                        }
                                    />
                                </Td>
                            )}
                            <Td>{index + 1}</Td>
                            <Td>
                                <Text fontWeight="medium">{entry.device_name || "—"}</Text>
                                <Text fontSize="xs" color="gray.500">
                                    {entry.device_imei ?? "—"}
                                </Text>
                            </Td>
                            <Td>
                                {entry.command_types.length === 0 ? (
                                    <Badge variant="outline" colorScheme="purple">
                                        —
                                    </Badge>
                                ) : (
                                    <Wrap spacing={1}>
                                        {entry.command_types.map((type) => (
                                            <WrapItem key={type}>
                                                <Badge variant="outline" colorScheme="purple">
                                                    {type}
                                                </Badge>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                )}
                            </Td>
                            <Td maxW="320px" whiteSpace="normal">
                                <SosContacts contacts={entry.contacts} />
                            </Td>
                            <Td>{entry.sim_provider || "—"}</Td>
                            <Td>
                                <Text fontSize="xs">{entry.login_name || "—"}</Text>
                            </Td>
                            <Td>
                                <WhitelistStatusBadge status={entry.status} />
                            </Td>
                            <Td>
                                <Text fontSize="xs">{formatDate(entry.created_at)}</Text>
                            </Td>
                            {onComplete && (
                                <Td>
                                    <CompleteButton
                                        onConfirm={() => onComplete(entry.device_imei)}
                                        isLoading={
                                            completingImei === String(entry.device_imei)
                                        }
                                        isDisabled={
                                            completingImei != null &&
                                            completingImei !== String(entry.device_imei)
                                        }
                                    />
                                </Td>
                            )}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
