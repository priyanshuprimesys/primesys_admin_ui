import { useContext } from "react"
import { DeviceExchangeParentContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeParentContext/DeviceExchangeParentContext"
import { DeviceExchangeStudentContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";

const DeviceExchangeDetail = () => {

    const { parentDeviceName } = useContext(DeviceExchangeParentContext);
    const {studentDeviceOneName,studentDeviceSecondName } = useContext(DeviceExchangeStudentContext);


    return (
        <div className="w-full space-y-2">
            <div className="flex gap-2">
                <p className="m-0 font-semibold">Parent Device:</p>
                <p className="m-0 font-medium text-theme-linkColor">{parentDeviceName}</p>
            </div>
            <div className="flex gap-2">
                <p className="m-0 font-semibold">Old Device:</p>
                <p className="m-0 font-medium text-theme-linkColor">{studentDeviceOneName}</p>
            </div>
            <div className="flex gap-2">
                <p className="m-0 font-semibold">New Device:</p>
                <p className="m-0 font-medium text-theme-linkColor">{studentDeviceSecondName}</p>
            </div>
        </div>
    )
}

export default DeviceExchangeDetail
