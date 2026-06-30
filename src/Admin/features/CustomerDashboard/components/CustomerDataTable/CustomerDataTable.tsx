// import { useState } from "react";
// import ChakraUISelectBox from "../../../../../global/ChakraUIComponents/SelectBox/ChakraUISelectBox";
// import DeviceTypeJson from "../../data/DeviceType.json";
import { DivisionDeviceDataTable } from "../DivisionDeviceDataTable/DivisionDeviceDataTable";

export const CustomerDataTable = () => {

  // const [_deviceType, setDeviceType]= useState<string>('');
  

  




  return (
    <>
      <div className="my-2">
        <h1 className="font-medium underline underline-offset-1 text-base">
          Customer Data Insights
        </h1>
      </div>
      {/* <div className="my-2">
        <ChakraUISelectBox data={DeviceTypeJson} Label="deviceName" setSelectValue={setDeviceType} Value="deviceNo" placeHolder="Select device type" />
      </div> */}
      <div>
      <DivisionDeviceDataTable/>
      </div>
    </>
  );
};
