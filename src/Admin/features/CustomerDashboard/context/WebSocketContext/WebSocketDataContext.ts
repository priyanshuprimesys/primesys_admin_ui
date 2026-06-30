import { createContext } from "react";
import { IWebSocketResponseInterface } from "../../interfaces/WebSocketInterface/WebSocketResponseInterface";






interface WebSocketInterface{
    webSocketData:IWebSocketResponseInterface | null;
    setWebSocketData: React.Dispatch<React.SetStateAction<IWebSocketResponseInterface |  null>>;
    webSocketLiveImei:number | null;
    setWebSocketLiveImei: React.Dispatch<React.SetStateAction<number | null>>;
    webSocketLiveName: string | null;
    setWebSocketLiveName: React.Dispatch<React.SetStateAction<string | null>>;
    webSocketConnect:boolean;
    setWebSocketConnect: React.Dispatch<React.SetStateAction<boolean>>;
    dataLoading:boolean;
    setDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketdivisionId:string;
    setWebSocketDivisionId: React.Dispatch<React.SetStateAction<string>>;
}


const defaultValue:WebSocketInterface={
    webSocketData:{
        data: {
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
        event: ""
    },
    setWebSocketData:()=>{},
    webSocketLiveImei: null,
    setWebSocketLiveImei:()=> {},
    webSocketLiveName: null,
    setWebSocketLiveName:()=>{},
    webSocketConnect:false,
    setWebSocketConnect:() =>{},
    dataLoading:false,
    setDataLoading:()=>{},
    webSocketdivisionId:'',
    setWebSocketDivisionId:() =>{}
};



export const WebSocketDataContext = createContext(defaultValue);