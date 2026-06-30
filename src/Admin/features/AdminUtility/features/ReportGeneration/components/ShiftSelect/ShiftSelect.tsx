import { Select } from "@chakra-ui/react";
import shiftType from "../../data/shiftType.json";


interface DeviceTypeProps{
    disabled?:boolean;
    setSelectValue:(value:string) => void;
    selectValue:string;
}


const ShiftSelect: React.FC<DeviceTypeProps> = ({disabled,setSelectValue,selectValue}) => {
  return (
    <div className="w-full">
        <Select onChange={(e)=> setSelectValue(e.target.value)} value={selectValue} disabled={disabled} height={12} borderColor={"black"} borderWidth={2}  placeholder="Select Shift Type">
            {
                shiftType.map((item,index)=>(
                    <option key={index} value={item.shift}>{item.name}</option>
                ))
            }
        </Select>
    </div>
  )
}

export default ShiftSelect
