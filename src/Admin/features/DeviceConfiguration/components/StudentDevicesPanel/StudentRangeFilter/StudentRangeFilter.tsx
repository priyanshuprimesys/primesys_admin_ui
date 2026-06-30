import { useContext } from "react";
import { DeviceConfigurationRangeContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceConfigurationRange/DeviceConfigurationRangeContext";
import GlobalInputBox from "../../../../../../global/components/input/GobalInputBox";


const StudentRangeFilter = () => {

  const {setDeviceRangeOne,setDeviceRangeTwo} = useContext(DeviceConfigurationRangeContext);

  return (
    <>
      <div className="flex items-center space-x-4">
        <GlobalInputBox 
        placeHolder="Enter range" 
        setInputText={setDeviceRangeOne}
        type="number"
        className="w-20 px-1 py-1 text-sm border-2 border-gray-400 rounded outline-none focus:border-black placeholder:text-xss" />
        <GlobalInputBox 
        placeHolder="Enter range" 
        setInputText={setDeviceRangeTwo}
        type="number"
        className="w-20 px-1 py-1 text-sm border-2 border-gray-400 rounded outline-none focus:border-black placeholder:text-xss" />
      </div>
    </>
  );
};
export default StudentRangeFilter;