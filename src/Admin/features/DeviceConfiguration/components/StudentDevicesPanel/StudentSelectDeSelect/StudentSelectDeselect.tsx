import { ChangeEvent, useContext } from "react";
import { DeviceCommandContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";


interface StudentSelectProps {
  selected: boolean;
  onSelectStudent: (e: ChangeEvent<HTMLInputElement>) => void;
}




const StudentSelectDeselect: React.FC<StudentSelectProps> = ({ selected, onSelectStudent }) => {

  const {deviceCommand} = useContext(DeviceCommandContext);


  return (
    <div className="">
      <input
        id="select_deselect"
        disabled={deviceCommand =='' ? true :false}
        type="checkbox"
        checked={selected}
        onChange={onSelectStudent}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-200 rounded cursor-pointer " />
         <label htmlFor="select_deselect" className="w-full py-1 text-xs font-medium text-gray-200 ms-1 ">
          {selected ? "Deselect All" : "Select All"}
          </label>
    </div>
  )
}

export default StudentSelectDeselect
