import { useContext } from "react"
import { WebSocketContext } from "../../context/WebSocketContext/WebSocketContext"
import { IWebSocketResponseInterface } from "../../interfaces/WebSocketInterface/WebSocketResponseInterface";
import { IWebSocketErrorResponseInterface } from "../../interfaces/WebSocketInterface/WebSocketErrorResponseInterface";
import { WebSocketDataContext } from "../../context/WebSocketContext/WebSocketDataContext";




const useWebSocket = () =>{


    const {WebSocketClient,pingSocketInterval} = useContext(WebSocketContext);
    const {setWebSocketData,setWebSocketConnect} = useContext(WebSocketDataContext);

    const onWebSocketConnect = (deviceImei:number) =>{
        WebSocketClient.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        WebSocketClient.current.onopen = () =>{
            setWebSocketConnect(true);
            const startTrackEvent = {
                event:'start_track',
                device_imei: deviceImei
            }
            WebSocketClient.current?.send(JSON.stringify(startTrackEvent));
            // start ping 
            startPing()
        }


        WebSocketClient.current.onmessage = (message:MessageEvent<any>) =>{
            if(message.data)
            {
                const response: IWebSocketResponseInterface = JSON.parse(message.data);
                const errorResponse: IWebSocketErrorResponseInterface = JSON.parse(message.data);
                if(response.event=== 'current_location' && response.data)
                {
                    if(response.data && 'gsm_signal_strength' in response.data && 'voltage_level' in response.data)
                    {
                        setWebSocketData(response);
                    }
                }
                else if(response.event === "error")
                {
                    setWebSocketData(null);
                    if(errorResponse.data && 'error_msg' in errorResponse.data)
                    {
                        if(errorResponse.data.error_msg === 'location_not_found')
                        {

                        }
                        else if(errorResponse.data.error_msg === 'device_id_not_found')
                        {

                        }
                    }
                }
            }
        }


        WebSocketClient.current.onerror = (error) =>{
            WebSocketClient.current?.close();
            console.error("WebSocket Error:",error);
            // stop ping
            stopPing()
        }

        WebSocketClient.current.onclose = () =>{
            // stop ping
            stopPing()
        }
    }

    const onWebSokcetDisconnect = () =>{
        if(WebSocketClient.current)
        {
            setWebSocketConnect(false);
            WebSocketClient.current.close();
            // stop ping
            stopPing();
        }
    }

    const startPing  = () =>{
        stopPing();

        pingSocketInterval.current = setInterval(()=>{
            if(WebSocketClient.current && WebSocketClient.current.readyState === WebSocket.OPEN)
            {
                const pingEvent = {
                    event:'start_ping',
                    who:'1111111111111'
                };
                WebSocketClient.current.send(JSON.stringify(pingEvent));
            }
        },10000);
    }

    const stopPing = () =>{
        if(pingSocketInterval.current)
        {
            clearInterval(pingSocketInterval.current);
        }
    }



    return{
        onWebSocketConnect,
        onWebSokcetDisconnect,
        stopPing
    }
}


export default useWebSocket;