import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { useOutsideClickHandler } from "../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import { useGetDivisionDevices } from "../../hooks/queries/divisionDevices/customer-division-devices-hooks";
import { useGetDivisionDevicesLocation } from "../../hooks/queries/divisionDevicesLocation/customer-division-devices-location-hooks";
import { CustomerDivisionDevicesContext } from "../../context/DivisionDevicesContext/CustomerDivisionDevicesContext";
import { CustomerDivisionDevicesLocationContext } from "../../context/DivisionDevicesLocationContext/CustomerDivisionDevicesLocationContext";
import { DivisionDevicesDetailResponseInitialState } from "../../initialState/DivisionDevicesInitialState/DivisionDevicesResponseInitialState";
import { DivisionDevicesLocationDetailInitialState } from "../../initialState/DivisionDevicesLocation/DivisionDeviceLocationDetailInitialState";
import { CustomerDivisionDevicesFilteredContext } from "../../context/DivisionDevicesFilteredContext/CustomerDivisionDevicesFilteredContext";
import { IDivisionFilteredDetailDevicesInterface } from "../../interfaces/DivisionFilteredDevices/DivisionFilteredDevicesInterface";
import { DivisionDevicesFilteredDeviceInitialState } from "../../initialState/DivisionFilteredInitialState/DivisionDevicesFilteredDevices";
import { DivisionDeviceCountContext } from "../../context/DivisionDeviceCountContext/DivisionDeviceCountContext";
import { getLastOff48hrs, getOffTodayDeviceCount, getOnDeviceCount, getOnTodayDeviceCount } from "../../utils/deviceCount/deviceCount";
import { CustomerReportModuleContext } from "../../context/CustomerReportContext/CustomerReportModuleContext";
import { useGetCustomerReportModule } from "../../hooks/queries/reportModule/report-module-hooks";
import { isDeviceActive, isDeviceActiveToday, isDeviceOffSince48hrs, isDeviceOffToday } from "../../utils/deviceStatusTime/deviceStatusTime";
import useWebSocket from "../../utils/WebSocket/WebSocketConnection";
import { WebSocketDataContext } from "../../context/WebSocketContext/WebSocketDataContext";

interface InputSearchProps {
    data:any[];
    setUserName:(text:string)=> void;
    setUserPassword:(text:string)=> void;
    setLoginName:(text:string) => void;
    parentId:string;
}




const LoginInputData: React.FC<InputSearchProps> = ({ data,setUserName,setUserPassword,setLoginName,parentId }) => {


    //Websocket connection
    const {onWebSokcetDisconnect} = useWebSocket();
    const {setWebSocketData,setWebSocketDivisionId} = useContext(WebSocketDataContext);

    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>('');
    const [userDivisionId,setUserDivisionId] = useState<string>('');
    /**outside click handler */
    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(dataListActive);

    const {setCustomerDivisionDevices} = useContext(CustomerDivisionDevicesContext);
    const {setCustomerDivisionDeviceLocation,setLocationApiCallTime} = useContext(CustomerDivisionDevicesLocationContext);
    const {setCustomerDivisionFilteredDevices,customerDivisionFilteredDevices,setDeviceLoading} = useContext(CustomerDivisionDevicesFilteredContext);

    const {data:divisionDevices,isSuccess}= useGetDivisionDevices(userDivisionId);
    const {data:deviceLocation,isSuccess:locationSuccess} = useGetDivisionDevicesLocation(userDivisionId);
    const {data:reportData,isSuccess:reportSuccess} = useGetCustomerReportModule(userDivisionId);
    const {setReportModule} = useContext(CustomerReportModuleContext);

    const {
        setAllDeviceCount,
        setOffLast48DeviceCount,
        setOffTodayDeviceCount,
        setOnDeviceCount,
        setOnTodayDeviceCount
    } = useContext(DivisionDeviceCountContext);


    useEffect(()=>{
        if(isSuccess)
        {
            setCustomerDivisionDevices(divisionDevices.data);
            setDeviceLoading(true);
        }
    },[divisionDevices,isSuccess]);
    

    useEffect(()=>{
        if(locationSuccess)
        {
            setCustomerDivisionDeviceLocation(deviceLocation.data);
            setLocationApiCallTime(Math.floor(new Date().getTime() / 1000));
        }
    },[locationSuccess,deviceLocation]);


    useEffect(()=>{
        if(reportSuccess)
        {
            setReportModule(reportData.data);
        }
    },[reportSuccess,reportData]);


    useEffect(()=>{
        if(parentId === "")
        {
            setSelectedInput("");
            setUserDivisionId("");
            onWebSokcetDisconnect();
            setLoginName("");
            setUserName("");
            setUserPassword("");
            setCustomerDivisionDevices(DivisionDevicesDetailResponseInitialState);
            setCustomerDivisionDeviceLocation(DivisionDevicesLocationDetailInitialState);
            setCustomerDivisionFilteredDevices(DivisionDevicesFilteredDeviceInitialState);
            setAllDeviceCount(0);
            setOffLast48DeviceCount(0);
            setOffTodayDeviceCount(0);
            setOnDeviceCount(0);
            setOnTodayDeviceCount(0);
            setWebSocketData(null)
        }
    },[parentId]);


    const filteredDevices:IDivisionFilteredDetailDevicesInterface={
        data:{
            ...DivisionDevicesFilteredDeviceInitialState.data,
            result:[]
        }
    }


    const devicesCount = useCallback(async ()=>{
        if(deviceLocation?.data.success === true)
        {         
            setOnDeviceCount(await getOnDeviceCount(deviceLocation.data));
            setOnTodayDeviceCount(await getOnTodayDeviceCount(deviceLocation.data));
            setOffTodayDeviceCount(await getOffTodayDeviceCount(deviceLocation.data));
            setOffLast48DeviceCount(await getLastOff48hrs(deviceLocation.data));
        }

    },[customerDivisionFilteredDevices,divisionDevices,deviceLocation]);


    useEffect(()=>{
        if(isSuccess && locationSuccess)
        {
           
            divisionDevices.data.data.result.forEach((device)=>{
                    const deviceFilterLocation = deviceLocation.data.data.result.find(locationDevice=> locationDevice.deviceImei === device.imeiNo);
                    if(deviceFilterLocation){

                        let deviceStatus:string ="gray";

                        if(isDeviceActive(deviceFilterLocation.timestamp)){
                            deviceStatus = "green";
                        }
                        else if(isDeviceActiveToday(deviceFilterLocation.timestamp))
                        {
                            deviceStatus = "orange";
                        }
                        else if(isDeviceOffToday(deviceFilterLocation.timestamp))
                        {
                            deviceStatus = "red";
                        }
                        else if(isDeviceOffSince48hrs(deviceFilterLocation.timestamp))
                        {
                            deviceStatus = "gray";
                        }


                        filteredDevices.data.result.push({
                            deviceId: device.deviceId,
                            validDay: device.validDay,
                            name: device.name,
                            imeiNo: deviceFilterLocation.deviceImei,
                            deviceTypeId: device.deviceTypeId,
                            deviceUsertype: device.deviceUsertype,
                            deviceSimImeiNo: device.deviceSimImeiNo,
                            deviceNo: device.deviceNo,
                            simNo: device.simNo,
                            lat: deviceFilterLocation.lat,
                            lon: deviceFilterLocation.lon,
                            speed: deviceFilterLocation.speed,
                            timestamp: deviceFilterLocation.timestamp,
                            deviceStatus:deviceStatus
                        });
                    }
                });
                setCustomerDivisionFilteredDevices(filteredDevices);

                if(filteredDevices.data.result.length > 0){
                    setAllDeviceCount(divisionDevices.data.data.result.length);
                    devicesCount();
                }
        }
    },[divisionDevices,deviceLocation,isSuccess,locationSuccess]);



    useEffect(() => {
        if (dataListActive) {
            SetIsComponentVisible(true);
        }
        else {
            SetIsComponentVisible(false);
        }
    }, [dataListActive]);

    useEffect(() => {
        if (!isComponentVisible && dataListActive) {
            setDataListActive(false);
        }
    }, [isComponentVisible]);

    const handleDataListActive = () => {
        setDataListActive(!dataListActive);
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataListActive(true);
        setSelectedInput(e.target.value);
        if(e.target.value === ""){
            setLoginName("");
            setUserName("");
            setUserPassword("");
            setUserDivisionId('');
            setCustomerDivisionDevices(DivisionDevicesDetailResponseInitialState);
            setCustomerDivisionDeviceLocation(DivisionDevicesLocationDetailInitialState);
            setCustomerDivisionFilteredDevices(DivisionDevicesFilteredDeviceInitialState);
            setAllDeviceCount(0);
            setOffLast48DeviceCount(0);
            setOffTodayDeviceCount(0);
            setOnDeviceCount(0);
            setOnTodayDeviceCount(0);
            onWebSokcetDisconnect();
            setWebSocketData(null);
        }
     

    }



    const handleUserSelect = (name: string, username: string, user_name: string,password:string,id:string,divisionID:string) => {
        setSelectedInput(`${name} (${username})`);
        setLoginName(name);
        setDataListActive(false);
        setUserName(user_name);
        setUserPassword(password);
        setUserDivisionId(id);
        setWebSocketDivisionId(divisionID);
    }

    const filteredData = selectedInput ? data.filter(x => x.name.toLowerCase().includes(selectedInput.toLowerCase()) || x.user_name.toLowerCase().includes(selectedInput.toLowerCase())) : data;


    return (
        <>
            <div className="relative w-full ">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        {IconComponents.searchIcon}
                    </div>
                    <input
                        type="search"
                        className="block w-full px-2 py-3 text-xs text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black"
                        onClick={handleDataListActive}
                        onChange={(e) => handleSearchInput(e)}
                        value={selectedInput}
                        placeholder={'Search user'}
                        required />
                </div>

                {
                    dataListActive && isComponentVisible && (
                        <div ref={ref} className={`w-full z-10  px-3 py-2 mt-2 cursor-pointer absolute scrollbarContainer bg-gray-200 max-h-72`}>
                            {
                                filteredData ?
                                    filteredData.map((val, index) => (
                                        <p
                                            onClick={() => handleUserSelect(val.name, val.user_name, val.user_name,val.password,val.id,val.track_division_id)}
                                            className="py-1.5 text-sm font-medium border-b-2 border-b-white"
                                            key={index}>
                                            {`${val.name} (${val.user_name})`}
                                        </p>
                                    ))
                                    :
                                    <p className="m-0 text-xs font-medium text-center">No parent found</p>
                            }
                        </div>
                    )
                }
            </div>

        </>

    )
}

export default LoginInputData;
