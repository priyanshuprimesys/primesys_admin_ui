import React from "react"
import { IDeviceInfoDetailResponseInterface } from "../Interface/DeviceInfoDetailResponse";
import { BeatTimeConvert } from "../../../../../../../../utils/TimeConvert/BeatTimeConvert";
import { DeviceMapLocation } from "./DeviceMapLocation";
import { DeviceCommandInfoAccordian } from "./DeviceCommandInfoAccordian";
import { getTimeStampToDate } from "../../../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { getBatteryPercentCalucate } from "../../../../../../CustomerDashboard/utils/BatterySignalPercent/BatterySIgnalPercent";
import { getSignalCalculate } from "../../../../../../../../utils/PercentBatteryConvert/PercentBatteryConvertPercentage";

interface DeviceInformationInterface {
    deviceInfo: IDeviceInfoDetailResponseInterface
}

const cardCls  = "rounded-xl border border-gray-100 overflow-hidden bg-white transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5";
const cardOpen = "rounded-xl border border-gray-100 bg-white transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.14),0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5";
const cardHdr  = "flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 border-b border-gray-200 rounded-t-xl";
const rowCls   = "flex gap-2 border-b border-gray-100 py-1.5 last:border-0";
const lbl      = "text-xs font-semibold text-gray-600 flex-shrink-0";
const val      = "text-xs text-gray-800 break-all";

export const IssueDeviceInformation: React.FC<DeviceInformationInterface> = ({ deviceInfo }) => {
    const r = deviceInfo.data.result;

    return (
        <div className="w-full py-3 px-2 space-y-3 bg-[#e8eaf0]">

            {/* Row: Basic Info + Map */}
            <div className="flex flex-wrap gap-3">

                {/* Device Basic Info */}
                <div className={`${cardCls} flex-1 min-w-[200px] max-h-96 overflow-y-auto`}>
                    <div className={cardHdr}>
                        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Device Basic Info</span>
                    </div>
                    <div className="px-4 py-2">
                        {([
                            ["Device Name",        r?.deviceInfo?.deviceName],
                            ["Device IMEI",        r?.deviceImei],
                            ["Device No",          r?.deviceInfo?.deviceNo],
                            ["SIM No",             r?.deviceInfo?.deviceSimNo],
                            ["SIM IMEI No",        r?.deviceInfo?.deviceSimImeiNo],
                            ["Report Enable",      r?.deviceInfo?.reportEnable ? "True" : "False"],
                            ["Report Time Margin", r?.deviceInfo?.reportTimeMargin],
                            ["Report Dist Margin", r?.deviceInfo?.reportDistMargin],
                            ["On Track Margin",    r?.deviceInfo?.onTrackMargin],
                        ] as [string, unknown][]).map(([label, value]) => (
                            <div key={label} className={rowCls}>
                                <span className={lbl}>{label}:</span>
                                <span className={val}>{(value as string) ?? "—"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Location Map */}
                <div className={`${cardCls} flex-1 min-w-[200px] max-h-96 overflow-hidden p-0`}>
                    <DeviceMapLocation
                        lat={r?.location?.geoLocation?.coordinates[1]}
                        lon={r?.location?.geoLocation?.coordinates[0]}
                        speed={r?.location?.speed}
                        voltageLevel={r?.location?.voltageLevel}
                        signalStrength={r?.location?.gsmSignalStrength}
                        timestamp={r?.location?.timestamp}
                        kilometer={r?.location?.nearestRdps?.kilometer}
                        distance={r?.location?.nearestRdps?.distance}
                        featureDetail={r?.location?.nearestRdps?.featureDetail}
                    />
                </div>
            </div>

            {/* Device Location Info */}
            <div className={cardCls}>
                <div className={cardHdr}>
                    <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Device Location Info</span>
                </div>
                <div className="px-4 py-2 grid grid-cols-2 gap-x-6">
                    <div className={rowCls}><span className={lbl}>Speed:</span><span className={val}>{r?.location?.speed ?? "—"} km/hr</span></div>
                    <div className={rowCls}><span className={lbl}>Timestamp:</span><span className={val}>{getTimeStampToDate(r?.location?.timestamp)}</span></div>
                    <div className={rowCls}><span className={lbl}>Battery:</span><span className={val}>{getBatteryPercentCalucate(r?.location?.voltageLevel)}</span></div>
                    <div className={rowCls}><span className={lbl}>Network:</span><span className={val}>{getSignalCalculate(r?.location?.gsmSignalStrength)}</span></div>
                    <div className={rowCls}><span className={lbl}>GPS Real Time:</span><span className={val}>{r?.location?.status?.gpsRealTime ?? "—"}</span></div>
                    <div className={rowCls}><span className={lbl}>GPS Position:</span><span className={val}>{r?.location?.status?.gpsPosition ?? "—"}</span></div>
                    <div className="col-span-2 pt-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">RDPS Details</p>
                        <div className="grid grid-cols-2 gap-x-6">
                            <div className={rowCls}><span className={lbl}>Feature:</span><span className={val}>{r?.location?.nearestRdps?.featureDetail ?? "—"}</span></div>
                            <div className={rowCls}><span className={lbl}>Kilometer:</span><span className={val}>{r?.location?.nearestRdps?.kilometer ?? "—"} km</span></div>
                            <div className={rowCls}><span className={lbl}>Distance:</span><span className={val}>{r?.location?.nearestRdps?.distance ?? "—"} km</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Trip Info */}
            <div className={`${cardCls} max-h-60 overflow-y-auto`}>
                <div className={cardHdr}>
                    <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Device Trip Info</span>
                </div>
                <div className="px-4 py-2 space-y-3">
                    {r?.tripInfo?.map((item, i) => (
                        <div key={i}>
                            <p className="text-xs font-bold text-gray-700 mb-1">Trip no: {item.tripNo}</p>
                            <div className={rowCls}>
                                <span className={lbl}>Start–End Time:</span>
                                <span className={val}>{BeatTimeConvert(item.startTime)} – {BeatTimeConvert(item.endTime)}</span>
                            </div>
                            <div className={rowCls}>
                                <span className={lbl}>Start–End Km:</span>
                                <span className={val}>{item.tripStartKm} – {item.tripEndKm} km</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Device Command Info */}
            <div className={cardOpen}>
                <div className={cardHdr}>
                    <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Device Command Info</span>
                </div>
                <div className="px-4 py-3">
                    <DeviceCommandInfoAccordian commandInfo={r?.commands} />
                </div>
            </div>

        </div>
    );
}
