import React, { useEffect, useState } from "react"
import { IDeviceInfoDetailResponseInterface, IDeviceInfoInterface } from "../../../../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Interface/DeviceInfoDetailResponse"
import { getTimeStampToDate } from "../../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate"
import { getBatteryPercentCalucate } from "../../../../../CustomerDashboard/utils/BatterySignalPercent/BatterySIgnalPercent"
import { getSignalCalculate } from "../../../../../../../utils/PercentBatteryConvert/PercentBatteryConvertPercentage"
import { BeatTimeConvert } from "../../../../../../../utils/TimeConvert/BeatTimeConvert"
import { DeviceInfoInitialState } from "../../../../../IssueTracking/components/IssueDashboard/Components/IssueEditModule/Initialstate/DeviceInfoInitialstate"



interface DeviceInformationInterface{
    deviceData: IDeviceInfoDetailResponseInterface
}



export const DeviceInformation: React.FC<DeviceInformationInterface> = ({deviceData}) =>{

    const [deviceInfo,setDeviceInfo] = useState<IDeviceInfoInterface>(DeviceInfoInitialState);

    useEffect(()=>{
        if(deviceData.success){
            setDeviceInfo(deviceData.data.result);
        }
    },[deviceData.success]);


    return(
        <div className="w-full h-full px-4 py-3 my-6 border-2 border-gray-800">
            <div className="flex items-center gap-1 my-3">
                <h1 className="text-sm font-semibold">Note:</h1>
                <span className="text-sm text-red-400">The details below are the current details of Device</span>
            </div>
            <div className="flex flex-wrap gap-4 overflow-auto max-h-96">
                {/* Device basic Info */}
                <div className="border-[1px] border-black py-2 px-4 w-full md:w-[calc(50%-0.5rem)] max-h-96 overflow-y-scroll">
                    <h1 className="text-base font-bold">Device Basic Info:</h1>
                    <div className="pl-4">
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Name:</h1>
                            <p>{deviceInfo.deviceInfo.deviceName}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Imei:</h1>
                            <p>{deviceInfo.deviceImei}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device No:</h1>
                            <p>{deviceInfo.deviceInfo?.deviceNo}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Sim No:</h1>
                            <p>{deviceInfo.deviceInfo.deviceSimNo}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Sim Imei No:</h1>
                            <p>{deviceInfo.deviceInfo.deviceSimImeiNo}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Report Enable:</h1>
                            <p>{deviceInfo.deviceInfo.reportEnable ? 'True': 'False'}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Report Time Margin:</h1>
                            <p>{deviceInfo.deviceInfo.reportTimeMargin}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device Report Dist Margin:</h1>
                            <p>{deviceInfo.deviceInfo.reportDistMargin}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Device On Track Margin:</h1>
                            <p>{deviceInfo.deviceInfo.onTrackMargin}</p>
                        </div>
                    </div>
                </div>
                {/* Device Trip Info */}
                <div className="border-[1px] border-black py-2 px-4 w-full md:w-[calc(50%-0.5rem)] max-h-96 overflow-y-scroll">
                    <h1 className="text-base font-bold">Device Trip Info</h1>
                    <div className="pl-4 overflow-y-auto max-h-80">
                        {
                            deviceInfo.tripInfo.map((item,index)=>(
                                <div key={index}>
                                    <h1 className="my-2 font-bold text-black">
                                        Trip no: {item.tripNo}
                                    </h1>
                                    <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                                        <h1 className="font-medium">Start-End Time</h1>
                                        <span>{`${BeatTimeConvert(item.startTime)} - ${BeatTimeConvert(item.endTime)}`}</span>
                                    </div>
                                    <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                                        <h1 className="font-medium">Start-End Km</h1>
                                        <span>{`${item.tripStartKm} - ${item.tripEndKm} km`}</span>
                                    </div>
                                </div>
                                
                            ))
                        }
                        
                    </div>
                </div>
                {/* Device Location Info */}
                <div className="border-[1px] border-black py-2 px-4 w-full md:w-[calc(50%-0.5rem)] max-h-96 overflow-y-scroll">
                    <h1 className="text-base font-bold">Device Location Info</h1>
                    <div className="pl-4">
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Speed</h1>
                            <p>{deviceInfo.location.speed} km/hr</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">TimeStamp</h1>
                            <p>{getTimeStampToDate(deviceInfo.location.timestamp)}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Battery Level</h1>
                            <p>{getBatteryPercentCalucate(deviceInfo.location.voltageLevel)}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Network Level</h1>
                            <p>{getSignalCalculate(deviceInfo.location.gsmSignalStrength)}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Gps Real Time</h1>
                            <p>{deviceInfo.location.status.gpsRealTime}</p>
                        </div>
                        <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Gps Position</h1>
                            <p>{deviceInfo.location.status.gpsPosition}</p>
                        </div>
                        <div className="mt-2">
                            <h2 className="text-base font-semibold">RDPS Details</h2>
                            <div className="pl-4">
                                <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                                    <h1 className="font-semibold">Feature Detail</h1>
                                    <p>{deviceInfo.location.nearestRdps.featureDetail}</p>
                                </div>
                                <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                                    <h1 className="font-semibold">Kilometer</h1>
                                    <p>{deviceInfo.location.nearestRdps.kilometer} km/hr</p>
                                </div>
                                <div className="flex gap-2 border-b-[1px] border-gray-800 py-1">
                                    <h1 className="font-semibold">Distance</h1>
                                    <p>{deviceInfo.location.nearestRdps.distance} km</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Device Commands Info */}
                <div className="border-[1px] border-black py-2 px-4 w-full md:w-[calc(50%-0.5rem)] max-h-96 overflow-y-scroll">
                    <h1 className="text-base font-bold">Device Command Info</h1>
                    <div className="pl-4 overflow-y-auto max-h-80">
                        <div className=" border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Fn Set:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestFnSet?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestFnSet?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Fn Check:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestFn?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestFn?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">HBT Set:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestHbtSet?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestHbtSet?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">HBT Check:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestHbt?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestHbt?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Period Set:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestPeriodSet?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestPeriodSet?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Period Check:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestPeriod?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestPeriod?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">SOS Set:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestSosSet?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestSosSet?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">SOS Check:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestSos?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestSos?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Timer Set:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestTimerSet?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestTimerSet?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Timer Check:</h1>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestTimer?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestTimer?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                        <div className="border-b-[1px] border-gray-800 py-1">
                            <h1 className="font-semibold">Status:</h1>
                             <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Command:</h1>
                                <span>{deviceInfo.commands.latestStatus?.command ?? ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">Response</h1>
                                <span>{deviceInfo.commands.latestStatus?.deviceResponse ?? ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}