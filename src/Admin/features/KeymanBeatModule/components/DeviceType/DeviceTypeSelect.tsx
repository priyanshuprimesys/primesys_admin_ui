import { Select } from "@chakra-ui/react";
import deviceType from "../../data/deviceType.json";


interface DeviceTypeProps{
    disabled?:boolean;
    setSelectValue:(value:string) => void;
}


const DeviceTypeSelect: React.FC<DeviceTypeProps> = ({disabled,setSelectValue}) => {
  return (
    <div className="w-full">
        <Select onChange={(e)=> setSelectValue(e.target.value)} disabled={disabled} height={12} borderColor={"black"} borderWidth={2}  placeholder="Select device Type">
            {
                deviceType.map((item,index)=>(
                    <option key={index} value={item.deviceSearch}>{item.deviceName}</option>
                ))
            }
        </Select>
    </div>
  )
}

export default DeviceTypeSelect
