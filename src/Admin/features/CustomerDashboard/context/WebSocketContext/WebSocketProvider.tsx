import { useRef } from "react";
import { WebSocketContext } from "./WebSocketContext";





const WebSocketProvider = ({children}:any) =>{

    const WebSocketClient = useRef<WebSocket | null>(null);
    const pingSocketInterval = useRef<NodeJS.Timeout | number>(0);

    return(
        <WebSocketContext.Provider value={{
            WebSocketClient,pingSocketInterval
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}




export default WebSocketProvider;