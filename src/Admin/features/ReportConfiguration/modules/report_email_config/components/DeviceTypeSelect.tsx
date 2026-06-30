import { Box, Select, Text } from "@chakra-ui/react";
import { IDeviceType, IDeviceTypeResponse } from "../../../../../../interfaces/AppInterfaces/DeviceTypeInterface/DeviceTypeInterface";

interface Props {
    value: string;
    onChange: (value: string) => void;
    deviceType: IDeviceTypeResponse | null;
}

export const DeviceTypeSelect = ({ value, onChange, deviceType }: Props) => {
    return (
        <Box flex={1} minW="250px">
            <Text mb={2} fontWeight="600" fontSize="sm">
                Device Type
            </Text>
            <Select
                placeholder="Select Device Type"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {deviceType?.data?.result?.map((item: IDeviceType) => (
                    <option key={item.id} value={item.deviceTypeId}>
                        {item.deviceType}
                    </option>
                ))}
            </Select>
        </Box>
    );
};
