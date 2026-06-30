import {
    FiFileText,
    FiSettings,
    FiMap,
    FiMonitor,
} from "react-icons/fi";


export const sidebarItems = [
    // {
    //     label: "Dashboard",
    //     value: "DASHBOARD",
    //     icon: FiGrid,
    // },
    {
        label: "Report Logs",
        value: "REPORT_LOG",
        icon: FiFileText,
    },
    {
        label: "Summary Report",
        value: "SUMMARY_REPORT",
        icon: FiFileText,
    },
    {
        label: "Report Module",
        value: "REPORT_MODULE",
        icon: FiMonitor,
    },
    {
        label: "Device Config",
        value: "DEVICE_CONFIG",
        icon: FiSettings,
    },
    {
        label: "Trip Config",
        value: "TRIP_CONFIG",
        icon: FiMap,
    },
];