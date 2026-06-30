import { useContext } from "react";
import { WebSocketDataContext } from "../../../../context/WebSocketContext/WebSocketDataContext";
import { TimeStampToDateTime } from "../../../../utils/timeUtils/timeStampToData";
import { getBatteryPercentCalucate, getSignalPercentCalculate } from "../../../../utils/BatterySignalPercent/BatterySIgnalPercent";



const TrackHeader = () =>{

    const {webSocketLiveName,webSocketData,webSocketConnect} = useContext(WebSocketDataContext);


    return(
        <div className="absolute z-[1000]  border-2 px-2 border-black rounded bg-gray-100 top-0 right-0">
            <div className="flex justify-center pt-2">
                <h3>{webSocketConnect === true ? <span className="text-green-600 text-xss font-bold">Connected</span> : <span className="text-red-600 text-xss font-bold">Disconnected</span>}</h3>
            </div>
            {
                webSocketData &&
                <div className="px-4 py-4">
                <h1 className="text-xs text-center font-semibold mb-2">{webSocketLiveName}</h1>
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-1">
                        <h2 className="text-xs font-bold">Date&Time:</h2>
                        <span className="text-xs">{TimeStampToDateTime(webSocketData?.data.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <h2 className="text-xs font-bold">Speed:</h2>
                        <span className="text-xs">{`${webSocketData?.data.speed != undefined ? webSocketData.data.speed : "0"} km/h`}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-1">
                        <h2 className="text-xs font-bold">Battery:</h2>
                        <span className="text-xs">{getBatteryPercentCalucate(webSocketData?.data.voltage_level)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <h2 className="text-xs font-bold">Signal:</h2>
                        <span className="text-xs">{getSignalPercentCalculate(webSocketData?.data.gsm_signal_strength)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <h2 className="text-xs font-bold">Address:</h2>
                    <span className="text-xs">{Number(webSocketData?.data.rdps_dist_diff).toFixed(2)}{`meter from [${webSocketData?.data.nearest_rdps}]`}</span>
                </div>
            </div>
            }

        </div>
    )   
}



export default TrackHeader;