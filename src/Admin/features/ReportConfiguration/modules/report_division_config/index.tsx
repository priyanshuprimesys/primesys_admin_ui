import { Flex, Select, Box, Button } from "@chakra-ui/react";
import { IDeviceType } from "../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { useContext, useState } from "react";


export const ReportDivisionConfig = () => {

    const { deviceType } = useContext(DeviceTypeContext);
    const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);


    const handleGetConfig = () => {
    }


    return (
        <Box width="100%">
            <Flex direction="row" gap={4} align="center" maxW="50%">
                <Box flex={2} minW="180px">
                    <Select
                        placeholder="Select Device Type"
                        value={selectedDeviceType || ""}
                        onChange={(e) =>
                            setSelectedDeviceType(e.target.value)
                        }
                    >
                        {deviceType?.data?.result?.map((item: IDeviceType) => (
                            <option
                                key={item.deviceTypeId}
                                value={item.deviceTypeId}
                            >
                                {item.deviceType}
                            </option>
                        ))}
                    </Select>
                </Box>
                <Box flex={1}>
                    <Button
                        width="100%"
                        colorScheme="green"
                        onClick={handleGetConfig}
                    >
                        Get Config
                    </Button>
                </Box>
            </Flex>
        </Box>
    )
};
