import { isDeviceActive, isDeviceActiveToday, isDeviceOffSince48hrs, isDeviceOffToday } from "../../../utils/deviceStatusTime/deviceStatusTime";
import greenIcon from "../../../assets/Icons/GreenTracker_marker.svg";
import redIcon from "../../../assets/Icons/RedTracker_marker.svg";
import orangeIcon from "../../../assets/Icons/orangeTracker_Marker.svg";
import grayIcon from "../../../assets/Icons/grayTracker_marker.svg";

export const filterMapLiveIcons = (time:number) =>{
    let iconUrl;
    iconUrl = isDeviceActive(time) ? greenIcon :
            isDeviceActiveToday(time) ? orangeIcon :
            isDeviceOffToday(time) ? redIcon : 
            isDeviceOffSince48hrs(time) ? grayIcon :
            grayIcon;
    return iconUrl;
}