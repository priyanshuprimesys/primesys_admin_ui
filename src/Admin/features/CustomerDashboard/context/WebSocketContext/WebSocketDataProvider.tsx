import { useState } from "react";
import { WebSocketDataContext } from "./WebSocketDataContext";
import { IWebSocketResponseInterface } from "../../interfaces/WebSocketInterface/WebSocketResponseInterface";






const WebSocketDataProvider = ({children}:any) =>{


    const [webSocketData,setWebSocketData] = useState<IWebSocketResponseInterface | null>({
        data:{
            gsm_signal_strength: "",
            lan: 0,
            lan_direction: "",
            lat: 0,
            lat_direction: "",
            speed: 0,
            voltage_level: "",
            timestamp: 0,
            nearest_rdps: "",
            rdps_dist_diff: ""
        },
        event:""
    });

    const [webSocketLiveImei,setWebSocketLiveImei] = useState<number | null>(null);
    const [webSocketLiveName,setWebSocketLiveName] = useState<string | null>(null);
    const [webSocketConnect,setWebSocketConnect] = useState<boolean>(false);
    const [dataLoading,setDataLoading] = useState<boolean>(false);
    const [webSocketdivisionId,setWebSocketDivisionId] = useState<string>("");

    return(
        <WebSocketDataContext.Provider value={{
            webSocketData,setWebSocketData,
            webSocketLiveImei,setWebSocketLiveImei,
            webSocketLiveName,setWebSocketLiveName,
            webSocketConnect,setWebSocketConnect,
            dataLoading,setDataLoading,
            webSocketdivisionId,setWebSocketDivisionId
        }}>
        {children}
        </WebSocketDataContext.Provider>
    )
}

export default WebSocketDataProvider;