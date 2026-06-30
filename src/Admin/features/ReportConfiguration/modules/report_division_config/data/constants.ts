
import {
    FiGrid,
    FiFileText,
    FiMonitor,
    FiSettings,
    FiMap,
} from "react-icons/fi";

export const SIDEBAR_ITEMS = [
    {
        name: "Dashboard",
        value: "DASHBOARD",
        icon: FiGrid,
    },
    {
        name: "Report Logs",
        value: "REPORT_LOG",
        icon: FiFileText,
    },
    {
        name: "Report Module",
        value: "REPORT_MODULE",
        icon: FiMonitor,
    },
    {
        name: "Device Config",
        value: "DEVICE_CONFIG",
        icon: FiSettings,
    },
    {
        name: "Trip Config",
        value: "TRIP_CONFIG",
        icon: FiMap,
    },
];
