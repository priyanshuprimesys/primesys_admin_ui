import { Select } from "@chakra-ui/react";
import { useGetAllDeviceTypeQuery } from "../../../../../../../api/queries/app/hooks/device-types-hooks";


interface DeviceTypeProps {
    disabled?: boolean;
    setSelectValue: (value: string) => void;
    selectValue: string;
}


const DeviceTypeSelect: React.FC<DeviceTypeProps> = ({ disabled, setSelectValue, selectValue }) => {

    const { data } = useGetAllDeviceTypeQuery();
    return (
        <div className="w-full">
            <Select onChange={(e) => setSelectValue(e.target.value)} value={selectValue} disabled={disabled} height={12} borderColor={"black"} borderWidth={2} placeholder="Select device Type">
                {
                    data?.data.data.result.map((item, index) => (
                        <option key={index} value={item.deviceTypeId}>{item.deviceType}</option>
                    ))
                }
            </Select>
        </div>
    )
}

export default DeviceTypeSelect
