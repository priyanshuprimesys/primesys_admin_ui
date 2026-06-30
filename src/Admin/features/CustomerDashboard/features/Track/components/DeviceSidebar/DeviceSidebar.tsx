import { useContext, useState,useEffect } from "react";
import { CustomerDivisionDevicesFilteredContext } from "../../../../context/DivisionDevicesFilteredContext/CustomerDivisionDevicesFilteredContext";
import {Input,Button, IconButton} from "@chakra-ui/react";
import DeviceActiveRadio, { RadioLabelValueInterface } from "./DeviceActiveRadio";
import { IconComponents } from "../../../../../../../global/Icons/IconsStore";
import useWebSocket from "../../../../utils/WebSocket/WebSocketConnection";
import { WebSocketDataContext } from "../../../../context/WebSocketContext/WebSocketDataContext";



const DeviceSidebar = () =>{
    
    // Web Socket connection 
    const {onWebSocketConnect} = useWebSocket();

    // WebSocket data context

    const {customerDivisionFilteredDevices,deviceLoading,setDeviceLoading} = useContext(CustomerDivisionDevicesFilteredContext);
    const [filterInput,setFilterInput] = useState<string>("");
    const [statusFilter,setStatusFilter] = useState<string>("blue");
    const [active,setActive] = useState<boolean>(false);
    const {setWebSocketLiveName,setWebSocketLiveImei} = useContext(WebSocketDataContext);

    useEffect(()=>{
        setTimeout(()=>{
            setDeviceLoading(false);
        },1800);
    },[deviceLoading]);



    const deviceStatusFilter:RadioLabelValueInterface[] = [
        {
            label:"",
            value:"blue",
            colorScheme:"blue",
            size:"lg",
            borderColor:"blue"
        },
        {
            label:"",
            value:"green",
            colorScheme:'green',
            size:"lg",
            borderColor:"green"
        },
        {
            label:"",
            value:"orange",
            colorScheme:'orange',
            size:"lg",
            borderColor:"orange"
        },
        {
            label:"",
            value:"red",
            colorScheme:'red',
            size:"lg",
            borderColor:"red"
        },
        {
            label:"",
            value:"gray",
            colorScheme:'gray',
            size:"lg",
            borderColor:"gray"
        },
    ];



    const handleClick = (imei:number,name:string) =>{
        onWebSocketConnect(imei);
        setWebSocketLiveImei(imei);
        setWebSocketLiveName(name);
    }
  

    return(
        <>
        <div className={`h-full ${active ? '-left-40' : ''} transition-all duration-200 ease-in  overflow-hidden bg-white border-2 border-black rounded py-4 px-2 z-50 absolute`}>
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                <h1 className="text-xs font-bold text-black">
                    Device Count:
                </h1>
                <p className="m-0 text-xs text-black">
                    {
                        customerDivisionFilteredDevices.data.result.length > 1 ?
                        customerDivisionFilteredDevices.data.result.filter(x=> statusFilter === "blue" || x.deviceStatus.toLowerCase().includes(statusFilter.toLowerCase())).length
                        :
                        0
                    }
                </p>
                </div>
                <div>
                <IconButton aria-label="close" onClick={()=>setActive(!active)} icon={IconComponents.barIcon} />
        </div>
            </div>
            <DeviceActiveRadio data={deviceStatusFilter} setValue={setStatusFilter} value={statusFilter}/>
            <Input type="search" onChange={(e)=> setFilterInput(e.target.value)} placeholder="Enter device" />
            <div className="py-2 px-1 my-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-slate-700 scrollbar-track-slate-300 h-[82%] overflow-y-scroll flex flex-col">
                {   deviceLoading 
                        ?
                        <div>
                            <h3 className="text-sm font-bold text-center">Devices Loading.......</h3>
                        </div>
                        :
                    customerDivisionFilteredDevices.data.result.length > 1 ?
                    customerDivisionFilteredDevices.data.result.filter(x => x.name.toLowerCase().includes(filterInput.toLowerCase()))
                    .filter(x => statusFilter === "blue" || x.deviceStatus.toLowerCase().includes(statusFilter.toLowerCase()))
                    .map((item,index)=>(
                        <Button onClick={()=> handleClick(item.imeiNo,item.name)} backgroundColor={'white'} className={`text-center cursor-pointer text-xs font-medium py-1.5  border mb-1 border-black rounded border-b-4 ${item.deviceStatus == "orange" ? 'border-orange-600': `border-${item.deviceStatus}-600`}`} key={index}>
                            {item.name}
                        </Button>
                    ))
                    :
                    <h1 className="py-2 font-medium text-center text-black">
                        No Device
                    </h1>
                }
            </div>
        </div>

        </>
    )
}



export default DeviceSidebar;