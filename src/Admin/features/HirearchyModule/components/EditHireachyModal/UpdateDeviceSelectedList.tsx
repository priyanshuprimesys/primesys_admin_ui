import React, { useContext } from "react";
import { HirearchyModuleUpdateContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleUpdateContext/HirearchyModuleUpdateContext";
import { Button } from "@chakra-ui/react";



interface UpdateInterface{
  setClearSelectedDevice: (val:boolean) => void;
}



const UpdateDeviceSelectedList: React.FC<UpdateInterface> = ({
  setClearSelectedDevice
}) => {
  const { selectedDeviceList} = useContext(HirearchyModuleUpdateContext);

  const handleClick = () =>{
    setClearSelectedDevice(true);
  }

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex flex-col w-full">
      <label htmlFor="devices" className="px-2 font-semibold">
        Selected Devices:
      </label>
      <textarea
        className="w-full border-2 border-black"
        value={selectedDeviceList}
        cols={40}
        rows={2}
        readOnly
      ></textarea>
      </div>
      <div className="mt-4">
        <Button colorScheme="red"  onClick={handleClick}>Clear</Button>
      </div>
      
    </div>
  );
};

export default UpdateDeviceSelectedList;
