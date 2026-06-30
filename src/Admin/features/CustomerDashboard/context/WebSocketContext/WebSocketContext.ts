import { createContext, MutableRefObject } from "react";




interface SocketInterface{
    WebSocketClient: MutableRefObject<WebSocket | null>;
    pingSocketInterval: MutableRefObject<NodeJS.Timeout | number>;
}

const defaultValue:SocketInterface={
    WebSocketClient:{current:null},
    pingSocketInterval:{current:0}
}


export const WebSocketContext = createContext(defaultValue);