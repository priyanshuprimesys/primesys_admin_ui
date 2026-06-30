import { useContext } from "react"
import { DeviceExchangeStudentContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";
import { DeviceExchangeResponseContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeResponseContext/DeviceExchangeResponseContext";
import { DeviceExchangeResponseInitialState } from "../../../../../initialStates/AppInitialStates/DeviceExchangeInitialState/DeivceExchangeResponseInitialState";

const DeviceExchangeResetButton = () => {


    const { setStudentDeviceOne, setStudentDeviceOneName, setStudentDeviceSecond, setStudentDeviceSecondName } = useContext(DeviceExchangeStudentContext);
    const { setExchangeDataResponse } = useContext(DeviceExchangeResponseContext);


    const handleReset = () => {
        setStudentDeviceOne('');
        setStudentDeviceOneName('');
        setStudentDeviceSecond('');
        setStudentDeviceSecondName('');
        setExchangeDataResponse(DeviceExchangeResponseInitialState);

    }



    return (
        <button type="button" onClick={handleReset} className="text-gray-900 bg-white border-2 border-red-600 outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">
            Reset
        </button>
    )
}

export default DeviceExchangeResetButton
