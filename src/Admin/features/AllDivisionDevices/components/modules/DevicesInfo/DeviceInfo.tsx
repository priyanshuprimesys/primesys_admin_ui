import { useContext } from "react"
import { DeviceDivisionStudents } from "./components/DeviceDivisionStudents"
import { DeviceMapLocation } from "./components/DeviceMapLocation"
import { DeviceInfoContext } from "./context/DeviceInfoContext"
import { GetDeviceInfoByImei } from "../../../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/hooks/GetDeviceInfoByImei"
import { DeviceInformation } from "./components/DeviceInformation"
import { DeviceInfoDetailResponse } from "../../../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Initialstate/DeviceInfoInitialstate"







export const DeviceInfo = () =>{

    const {deviceImei} = useContext(DeviceInfoContext);
    const {data} = GetDeviceInfoByImei(deviceImei);


    return(
        <div className="h-full">
            <h1 className="mb-4 text-base font-bold">Device Information</h1>
            <DeviceDivisionStudents/>
            <DeviceInformation deviceData={data?.data ? data.data : DeviceInfoDetailResponse} />
            <div className="my-4">
                <div className="w-[100%]">
                    <DeviceMapLocation 
                        lat={data?.data.data.result.location.geoLocation.coordinates[1]} 
                        lon={data?.data.data.result.location.geoLocation.coordinates[0]}
                        speed={data?.data ? data.data.data.result.location.speed : 0}
                        signalStrength={data?.data ? data.data.data.result.location.gsmSignalStrength : 0}
                        voltageLevel={data?.data ? data.data.data.result.location.voltageLevel : 0}
                    />
                </div>
            </div>
            
        
            
        </div>
    )
}