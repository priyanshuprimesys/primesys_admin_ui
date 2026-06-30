import {
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
} from "@chakra-ui/react";

import { IDeviceType } from "../../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    filters: any;
    setFilters: any;
    deviceType: any;
    onRegenerate: () => void;
    isRegenerating: boolean
}

export const RegenerateReportModal = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    deviceType,
    onRegenerate,
    isRegenerating
}: Props) => {


    if (!filters.divisionId) {
        toast.error("No division found please refresh and select a division");
        return null;
    }

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >

            <ModalOverlay />

            <ModalContent
                borderRadius="20px"
            >

                <ModalHeader>
                    Regenerate Reports
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody>

                    <Flex
                        direction="column"
                        gap={5}
                    >

                        <Flex
                            direction="column"
                            gap={2}
                        >

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                            >
                                Report Date
                            </Text>

                            <Input
                                disabled={true}
                                type="date"
                                value={
                                    filters.reportDate
                                }
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev: any
                                        ) => ({
                                            ...prev,
                                            reportDate:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                        </Flex>

                        <Flex
                            direction="column"
                            gap={2}
                        >

                            <Text
                                fontSize="sm"
                                fontWeight="600"
                            >
                                Device Type
                            </Text>

                            <Select
                                placeholder="
                                    Select Device Type
                                "
                                value={
                                    filters.deviceTypeId
                                }
                                disabled={true}
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev: any
                                        ) => ({
                                            ...prev,
                                            deviceTypeId:
                                                e.target.value,
                                        })
                                    )
                                }
                            >

                                {deviceType?.data?.result?.map(
                                    (
                                        item: IDeviceType
                                    ) => (

                                        <option
                                            key={item.id}
                                            value={
                                                item.deviceTypeId
                                            }
                                        >
                                            {
                                                item.deviceType
                                            }
                                        </option>

                                    )
                                )}

                            </Select>

                        </Flex>

                    </Flex>

                </ModalBody>

                <ModalFooter
                    gap={3}
                >

                    <Button
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        colorScheme="teal"
                        onClick={
                            onRegenerate
                        }
                        isLoading={isRegenerating}
                    >
                        {isRegenerating ? "Regenerating..." : "Regenerate"}
                    </Button>

                </ModalFooter>

            </ModalContent>

        </Modal>
    );
};