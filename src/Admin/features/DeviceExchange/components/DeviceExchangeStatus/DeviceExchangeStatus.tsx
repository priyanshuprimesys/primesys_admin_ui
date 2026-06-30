import { useContext } from "react";
import DeviceExchangeDetail from "./DeviceExchangeResponse/DeviceExchangeDetail";
import { DeviceExchangeResponseContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeResponseContext/DeviceExchangeResponseContext";
// import { IoMdDoneAll } from "react-icons/io";
// import { RiErrorWarningLine } from "react-icons/ri";
import DeviceExchangeResponse from "./DeviceExchangeResponse/DeviceExchangeResponse";



const DeviceExchangeStatus = () => {

  const { exchangeDataResponse } = useContext(DeviceExchangeResponseContext);

  // const errorCount = exchangeDataResponse.data.result.split('\n').map(sentence => sentence.trim()).filter(sentence => sentence.includes('Error:'));


  return (
    <div className="w-full px-4 py-4 overflow-hidden bg-slate-100">
      <div className="flex items-center gap-2 py-1 mb-2 border-b-2 border-gray-500">
        <h1 className="text-base font-medium underline">Device Exchange</h1>
      </div>
      <div>
        {
          exchangeDataResponse.success ?
            <DeviceExchangeResponse />
            :
            <DeviceExchangeDetail />
        }

      </div>
      <div>

      </div>

    </div>
  )
}

export default DeviceExchangeStatus;
