import { DeviceInfoProvider } from "../../Admin/features/AllDivisionDevices/components/modules/DevicesInfo/context/DeviceInfoProvider"
import { CustomerLoginDetailProvider } from "../../Admin/features/CustomerDashboard/context/CustomerLoginDetailContext/CustomerLoginDetailProvider"
import CustomerReportModuleProvider from "../../Admin/features/CustomerDashboard/context/CustomerReportContext/CustomerReportModuleProvider"
import DivisionDeviceCountProvider from "../../Admin/features/CustomerDashboard/context/DivisionDeviceCountContext/DivisionDeviceCountProvider"
import CustomerDivisionDevicesProvider from "../../Admin/features/CustomerDashboard/context/DivisionDevicesContext/CustomerDivisionDevicesProvider"
import { CustomerDivisionDevicesFilteredProvider } from "../../Admin/features/CustomerDashboard/context/DivisionDevicesFilteredContext/CustomerDivisionDevicesFilteredProvider"
import CustomerDivisionDevicesLocationProvider from "../../Admin/features/CustomerDashboard/context/DivisionDevicesLocationContext/CustomerDivisionDevicesLocationProvider"
import WebSocketDataProvider from "../../Admin/features/CustomerDashboard/context/WebSocketContext/WebSocketDataProvider"
import WebSocketProvider from "../../Admin/features/CustomerDashboard/context/WebSocketContext/WebSocketProvider"
import { ExceptionReportProvider } from "../../Admin/features/CustomerDashboard/features/Report/context/ExceptionContext/ExceptionReportProvider"
import { IssueEditModuleProvider } from "../../Admin/features/IssueTracking/components/IssueDashboard/Components/IssueEditModule/context/IssueEditModuleProvider"
import IssueProvider from "../../Admin/features/IssueTracking/context/IssueContext/IssueProvider"
import { TableProvider } from "../../global/components/Table/context/TableProvider"
import { DeviceCommandHistoryProvider } from "../AppLayout/Admin/DeviceCommand/DeviceCommandHistory/DeviceCommandHistoryProvider"
import { DeviceCommandProvider } from "../AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandProvider"
import DeviceConfigurationRangeProvider from "../AppLayout/Admin/DeviceConfigurationContext/DeviceConfigurationRange/DeviceConfigurationRangeProvider"
import { DeviceFamilyNumberCommandProvider } from "../AppLayout/Admin/DeviceConfigurationContext/DeviceFamilyNumberCommand/DeviceFamilyCommandContext/DeviceFamilyNumberCommandProvider"
import { DevicePeriodCommandProvider } from "../AppLayout/Admin/DeviceConfigurationContext/DevicePeriodCommandContext/DevicePeriodCommandProvider"
import { DeviceStudentSelectProvider } from "../AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectProvider"
import { DeviceTypeProvider } from "../AppLayout/Admin/DeviceTypeContext/DeviceTypeProvider"
import { DivisionLoginTrackUsersProvider } from "../AppLayout/Admin/DivisionLoginTrackUsersContext/DivisionLoginTrackUsersProvider"
import { DivisionParentIdProvider } from "../AppLayout/Admin/DivisionParentIdContext/DivisionParentIdProvider"
import { DivisionRdpsProvider } from "../AppLayout/Admin/DivisionRdpsContext/DivisionRdpsProvider"
import { HireachyFormModuleProvider } from "../AppLayout/Admin/HirearchyModuleContext/HirearchyFormModuleContext/HirearchyFormModuleProvider"
import { HirearchyModuleParentProvider } from "../AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentProvider"
import { HirearchyModuleStudentProvider } from "../AppLayout/Admin/HirearchyModuleContext/HirearchyModuleStudentContext/HirearchyModuleStudentProvider"
import { HirearchyModuleUpdateProvider } from "../AppLayout/Admin/HirearchyModuleContext/HirearchyModuleUpdateContext/HirearchyModuleUpdateProvider"
import HirearchyTrackUserProvider from "../AppLayout/Admin/HirearchyModuleContext/HirearchyTrackUserContext/HirearchyTrackUserProvider"
import KeyManFileUploadProvider from "../AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadProvider"
import { StudentDeviceDetailProvider } from "../AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailProvider"
import { AdminDevicesProvider } from "../AppLayout/AdminDevicesContext/AdminDevicesProvider"
import { DataTableProvider } from "../AppLayout/DataTableContext/DataTableProvider"
import DeviceDetailProvider from "../AppLayout/DeviceDetailContext/DeviceDetailProvider"
import DeviceExchangeParentProvider from "../AppLayout/DeviceExchangeContext/DeviceExchangeParentContext/DeviceExchangeParentProvider"
import DeviceExchangeResponseProvider from "../AppLayout/DeviceExchangeContext/DeviceExchangeResponseContext/DeviceExchangeResponseProvider"
import DeviceExchangeStudentProvider from "../AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentProvider"
import { HeaderRouteNameProvider } from "../AppLayout/Header/HeaderRouteName/HeaderRouteNameProvider"
import { IssueTrackingProvider } from "../AppLayout/IssueTrackingContext/IssueTrackingProvider"
import SubSideBarContextProvider from "../AppLayout/subSidebarContext/SubSideBarContextProvider"
import { TestProvider } from "../AppLayout/Testcontext/TestProvider"
import { UserDetailProvider } from "../AppLayout/UserDetailContext/UserDetailProvider"
import { AuthenticationContextProvider } from "../AuthLayout/AuthenticationContext/AuthenticationContextProvider"
import { AuthErrorContextProvider } from "../AuthLayout/AuthErrorContext/AuthErrorContextProvider"
import { AuthLoaderContextProvider } from "../AuthLayout/AuthLoaderContext/AuthLoaderContextProvider"
import { IsRememberContextProvider } from "../AuthLayout/IsRememberContext/IsRememberContextProvider"
import { ActivityTrackingProvider } from "../AppLayout/ActivityTrackingContext/ActivityTrackingProvider"
import { CombineContexts } from "./CombineContext"
import React from "react"
import ReportConfigProvider from "../../Admin/features/ReportConfiguration/context/ReportConfigurationContext"



const providers = [
    AuthLoaderContextProvider,
    AuthErrorContextProvider,
    AuthenticationContextProvider,
    IsRememberContextProvider,
    UserDetailProvider,
    ActivityTrackingProvider,   // must be after UserDetailProvider
    TestProvider,
    DeviceExchangeParentProvider,
    DeviceExchangeStudentProvider,
    DeviceDetailProvider,
    DeviceExchangeResponseProvider, DivisionLoginTrackUsersProvider,
    HeaderRouteNameProvider, StudentDeviceDetailProvider,
    DevicePeriodCommandProvider, DeviceCommandProvider,
    DeviceStudentSelectProvider, DivisionParentIdProvider,
    HirearchyModuleParentProvider, HirearchyModuleStudentProvider,
    DeviceCommandHistoryProvider, HireachyFormModuleProvider,
    DataTableProvider, HirearchyModuleUpdateProvider,
    DeviceFamilyNumberCommandProvider, HirearchyTrackUserProvider,
    KeyManFileUploadProvider, DeviceConfigurationRangeProvider, CustomerLoginDetailProvider, TableProvider,
    CustomerDivisionDevicesProvider, CustomerDivisionDevicesLocationProvider,
    CustomerDivisionDevicesFilteredProvider, DivisionDeviceCountProvider,
    CustomerReportModuleProvider, WebSocketProvider, WebSocketDataProvider,
    ExceptionReportProvider, IssueProvider, DivisionRdpsProvider, DeviceTypeProvider,
    AdminDevicesProvider, SubSideBarContextProvider, IssueTrackingProvider, DeviceInfoProvider, IssueEditModuleProvider, ReportConfigProvider]


export const CombineContextProvider = ({ children }: { children: React.ReactNode }) => {
    return <CombineContexts components={providers} children={children} />
}