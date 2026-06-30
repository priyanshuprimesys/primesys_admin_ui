import { lazy, Suspense } from "react";
import { RouteNavigationInterface } from "../interfaces/RouteInterface/RouteNavigationInterface";
import { IconsStore } from "../global/Icons/IconsStore";

const LoginLayout = lazy(() => import("../views/auth/layouts/auth/AuthLayout"));
const AdminLayout = lazy(() => import("../views/auth/layouts/app/AppLayout"));
const PrivacyPolicy = lazy(() => import("../Admin/pages/PrivacyPolicy/index"));

// import LoginLayout from "../views/auth/layouts/auth/AuthLayout";
// import AdminLayout from "../views/auth/layouts/app/AppLayout";

/*** Route Error Component Calls */

// const RouteError = lazy(()=> import('../global/Errors/ErrorComponent/RouteError'))
import RouteError from "../global/Errors/ErrorComponent/RouteError";

/**Admin Components Calls */
// const Dashboard = lazy(()=> import('../Admin/features/Dashboard'));
// const DeviceConfiguration = lazy(()=> import('../Admin/features/DeviceConfiguration'));
// const DeviceDiagnose = lazy(()=> import('../Admin/features/DeviceDiagnose'));
// const DeviceExchange = lazy(()=> import('../Admin/features/DeviceExchange'));
// const DeviceUnregisterAndRemove = lazy(()=> import('../Admin/features/DeviceUnregisterAndRemove'));
// const HirearchyModule = lazy(()=> import('../Admin/features/HirearchyModule'));
// const IssueTracking = lazy(()=> import('../Admin/features/IssueTracking'));
// const KeymanBeatModule = lazy(()=> import('../Admin/features/KeymanBeatModule'));
// const PatrolmanBeatModule = lazy(()=> import('../Admin/features/PatrolmanBeatModule'));
// const ServerStatics = lazy(()=> import('../Admin/features/ServerStatics'));
// const StudentNameUpdate = lazy(()=> import('../Admin/features/StudentNameUpdate'));

// import Dashboard from "../Admin/pages/Dashboard/Dashboard";
import DeviceConfiguration from "../Admin/pages/DeviceConfiguration/DeviceConfiguration";
// // import DeviceDiagnose from "../Admin/features/DeviceDiagnose";
import DeviceExchange from "../Admin/pages/DeviceExchange/DeviceExchange";
// import DeviceUnregisterAndRemove from "../Admin/features/DeviceUnregisterAndRemove";
import DeviceSubscriptionModule from "../Admin/pages/DeviceSubscription/DeviceSubscription";
import { HirearchyModule } from "../Admin/pages/HirearchyModule/HirearchyModule";
import KeymanBeatModule from "../Admin/features/KeymanBeatModule";
// import PatrolmanBeatModule from "../Admin/features/PatrolmanBeatModule";
// import ServerStatics from "../Admin/features/ServerStatics";
// import StudentNameUpdate from "../Admin/features/StudentNameUpdate";
import LogoutService from "../api/services/LogoutService";
import Loader from "../global/components/loader/Loader";
import AllDivisionDevices from "../Admin/pages/AllDivisionDevices/AllDivisionDevices";
import AdminUtility from "../Admin/pages/AdminUtility/AdminUtility";
// import CustomerDashboard from "../Admin/pages/CustomerDashboard/CustomerDashboard";
// import IssueTrackPage from "../Admin/pages/IssueTrackPage/IssueTrackPage";
import RdpsUtility from "../Admin/features/AdminUtility/features/RdpsUtility/RdpsUtility";
// import { PrivacyPolicy } from "../Admin/pages/PrivacyPolicy/index";

import { IOTDataModule } from "../Admin/pages/IOTData/IOTData";
// import { RdpsUtilityPage } from "../Admin/pages/AdminUtility/RdpsUtility/rdps-utility";
import { DeviceInspectionDashboard } from "../Admin/features/DeviceInspection/DeviceInspectionIndex";
// import ReportPermissionTab from "../Admin/features/ReportPermission/ReportPermissionTab";
import LocationUtility from "../Admin/features/LocationUtility";
import IssueLLMPage from "../Admin/pages/IssueLLMPage/IssueLLMPage";
import { ReportConfiguration } from "../Admin/features/ReportConfiguration";
import Operations from "../Admin/pages/Operations/Operations";
import ReportDivisionConfigProvider from "../Admin/features/ReportConfiguration/modules/report_division_config/context/ReportDivisionConfigContext";
import { EmailDashboard } from "../Admin/features/EmailDashboard";

export const navigationRoutes: RouteNavigationInterface[] = [
  {
    path: "/",
    name: "Login",
    icon: null,
    element: (
      <Suspense fallback={<Loader />}>
        {" "}
        <LoginLayout />
      </Suspense>
    ),
    isSidebarMenu: false,
    isPrivate: false,
    errorElement: () => <RouteError />,
  },
  {
    path: "/",
    name: "Admin Dashboard",
    icon: null,
    element: (
      <Suspense fallback={<Loader />}>
        {" "}
        <AdminLayout />
      </Suspense>
    ),
    isSidebarMenu: false,
    isPrivate: true,
    errorElement: () => <RouteError />,
    children: [
      {
        path: "admin",
        innerPath: "",
        name: "Dashboard",
        icon: IconsStore.dashboardIcon,
        element: <IssueLLMPage />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: () => {
          alert("hello");
        },
        errorElement: <RouteError />,
      },
      {
        path: "admin/all_devices",
        innerPath: "all_devices",
        name: "Division Devices",
        icon: IconsStore.deviceDiagnoseIcon,
        element: <AllDivisionDevices />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      // {
      //   path: "admin/issue_llm",
      //   innerPath: "issue_llm",
      //   name: "Issue LLM",
      //   icon: IconsStore.ticketIcon,
      //   element: <IssueLLMPage />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      {
        path: "admin/operations",
        innerPath: "operations",
        name: "Operations",
        icon: IconsStore.operationsIcon,
        element: <Operations />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      // {
      //   path: 'admin/issue_tracking',
      //   innerPath: 'issue_tracking',
      //   name: 'Issue Track',
      //   icon: IconsStore.usersWindow,
      //   element: <IssueTrackPage />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />
      // },
      {
        path: "admin/device_configuration",
        innerPath: "device_configuration",
        name: "Device Configuration",
        icon: IconsStore.deviceConfigurationIcon,
        element: <DeviceConfiguration />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/beat_module",
        innerPath: "beat_module",
        name: "Beat Module",
        icon: IconsStore.keymanBeatIcon,
        element: <KeymanBeatModule />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/device_exchange",
        innerPath: "device_exchange",
        name: "Device Exchange",
        icon: IconsStore.deviceExchangeIcon,
        element: <DeviceExchange />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/hirearchy_module",
        innerPath: "hirearchy_module",
        name: "Hirearchy Module",
        icon: IconsStore.hirearchyModuleIcon,
        element: <HirearchyModule />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/device_subscription",
        innerPath: "device_subscription",
        name: "Device Subscription",
        icon: IconsStore.calendarIcon,
        element: <DeviceSubscriptionModule />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/admin_utility",
        innerPath: "admin_utility",
        name: "Admin Utility",
        icon: IconsStore.severStaticsIcon,
        element: <AdminUtility />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
        children: [
          {
            path: "rdps",
            innerPath: "rdps",
            name: "Rdps Utility",
            icon: IconsStore.severStaticsIcon,
            element: <RdpsUtility />,
            isSidebarMenu: true,
            isPrivate: true,
            loaderFun: undefined,
            errorElement: <RouteError />,
          }
        ]
      },
      // {
      //   path: "admin/rdps_utility",
      //   innerPath: "rdps_utility",
      //   name: "RDPS Utility",
      //   icon: IconsStore.mapIcon,
      //   element: <RdpsUtilityPage />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      {
        path: "admin/location_utility",
        innerPath: "location_utility",
        name: "Location Utility",
        icon: IconsStore.mapIcon,
        element: <LocationUtility />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/admin_iot_data",
        innerPath: "admin_iot_data",
        name: "IOT Data",
        icon: IconsStore.packetIcon,
        element: <IOTDataModule />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/device_inspection",
        innerPath: "device_inspection",
        name: "Device Inspection",
        icon: IconsStore.inspection,
        element: <DeviceInspectionDashboard />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      // {
      //   path: "admin/device_inspection_detail",
      //   innerPath: "device_inspection_detail",
      //   name: "Device Inspection",
      //   icon: IconsStore.inspection,
      //   element: <DeviceInspectionEditView />,
      //   isSidebarMenu: false,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      // {
      //   path: "admin/reports_permission",
      //   innerPath: "reports_permission",
      //   name: "Reports and Permission",
      //   icon: IconsStore.permissionIcon,
      //   element: <ReportPermissionTab />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      {
        path: "admin/report_configuration",
        innerPath: "report_configuration",
        name: "Report Configuration",
        icon: IconsStore.permissionIcon,
        element: <ReportDivisionConfigProvider> <ReportConfiguration /> </ReportDivisionConfigProvider>,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      {
        path: "admin/report_email",
        innerPath: "report_email",
        name: "Report Email",
        icon: IconsStore.emailIcon,
        element: <EmailDashboard />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: undefined,
        errorElement: <RouteError />,
      },
      // {
      //   path: "admin/device_inspection/report",
      //   innerPath: "device_inspection/report",
      //   name: "Device Inspection Report",
      //   icon: IconsStore.inspection,
      //   element: <InspectionReport />,
      //   isSidebarMenu: false,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      // {
      //   path: "admin/customer",
      //   innerPath: "",
      //   name: "Customer",
      //   icon: IconsStore.websiteIcon,
      //   element: <CustomerDashboard />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   errorElement: <RouteError />,
      // },
      // {
      //   path: 'admin/patrolman_beat_module',
      //   innerPath:'patrolman_beat_module',
      //   name: 'Patrolman Beat Module',
      //   icon: IconsStore.patrolmanBeatIcon,
      //   element: <PatrolmanBeatModule />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />
      // },
      // {
      //   path: "admin/student_name",
      //   innerPath: "student_name",
      //   name: "Student Name Update",
      //   icon: IconsStore.studentNameUpdateIcon,
      //   element: <StudentNameUpdate />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      // {
      //   path: 'admin/device_unregister',
      //   innerPath:'device_unregister',
      //   name: 'Device UnRegister',
      //   icon: IconsStore.deviceUnRegisterIcon,
      //   element: <DeviceUnregisterAndRemove />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />
      // },
      // {
      //   path: "admin/device_diagnose",
      //   innerPath: "device_diagnose",
      //   name: "Device Diagnose",
      //   icon: IconsStore.deviceDiagnoseIcon,
      //   element: <DeviceDiagnose />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      // {
      //   path: "admin/server_statics",
      //   innerPath: "server_statics",
      //   name: "Server Statics",
      //   icon: IconsStore.severStaticsIcon,
      //   element: <ServerStatics />,
      //   isSidebarMenu: true,
      //   isPrivate: true,
      //   loaderFun: undefined,
      //   errorElement: <RouteError />,
      // },
      {
        path: "admin/logout",
        innerPath: "logout",
        name: "Logout",
        icon: IconsStore.logOutIcon,
        element: <LogoutService />,
        isSidebarMenu: true,
        isPrivate: true,
        loaderFun: null,
        errorElement: <RouteError />,
      },
    ],
  },
  {
    path: "/privacy",
    name: "privacy",
    icon: null,
    element: (
      <Suspense fallback={<Loader />}>
        <PrivacyPolicy />
      </Suspense>
    ),
    isSidebarMenu: false,
    isPrivate: false,
    errorElement: () => <RouteError />,
  },
  {
    path: "*",
    name: "Error",
    icon: null,
    element: <RouteError />,
    isSidebarMenu: false,
    isPrivate: false,
    errorElement: () => null,
  },
];
