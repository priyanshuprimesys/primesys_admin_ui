import { Outlet } from "react-router-dom";
import Sidebar from "../../../../components/applayout/sidebar/Sidebar";
// import SubSidebar from "../../../../components/applayout/subSidebar/SubSidebar";
import AppCss from '../../../../styles/modules/AppStyles/AppCss.module.css';
import AdminHeader from '../../../../components/applayout/Header/Header';
import { useUserDetailQuery } from "../../../../api/queries/app/hooks/user-detail-api-hooks";
import { useContext, useEffect } from "react";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { useGetDivisionLoginTrackUser } from "../../../../api/queries/app/hooks/division_logins_track_user_hooks";
import { DivisionLoginTrackUsersContext } from "../../../../contexts/AppLayout/Admin/DivisionLoginTrackUsersContext/DivisionLoginTrackUsersContext";
import useWebAPIWorker from "../../../../utils/longProcess/apiWorker.main";
import { AdminDevicesContext } from "../../../../contexts/AppLayout/AdminDevicesContext/AdminDevicesContext";
import SubSidebar from "../../../../components/applayout/subSidebar/SubSidebar";
import SubSidebarContext from "../../../../contexts/AppLayout/subSidebarContext/SubSideBarContext";
import { useGetAllDeviceTypeQuery } from "../../../../api/queries/app/hooks/device-types-hooks";
import { DeviceTypeContext } from "../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";
import { ActivityProvider } from "../../../../contexts/AppLayout/ActivityContext/ActivityProvider";



const AppLayout = () => {

    const { data: alldevices } = useWebAPIWorker('/v2/device/all-devices');
    // const {data:alldeviceLocation} = useWebAPIWorker('/v2/device/all/location?divisionId=66f049e919fe834a3b06ed8f');
    const { setUserDetail } = useContext(UserDetailContext);
    const { setAdminDevices } = useContext(AdminDevicesContext);
    const { setDivisionLoginTrackUserDetail } = useContext(DivisionLoginTrackUsersContext);
    const { sidebarExpand } = useContext(SubSidebarContext)

    const { data, isSuccess } = useUserDetailQuery();
    const { data: divisionLoginsData, isSuccess: divisionLoginSuccess } = useGetDivisionLoginTrackUser();
    const { data: deviceTypeData, isSuccess: deviceTypeSuccess } = useGetAllDeviceTypeQuery();
    const { setDeviceType } = useContext(DeviceTypeContext);

    useEffect(() => {
        if (isSuccess) {
            setUserDetail(data.data);
        }
    }, [data, isSuccess]);

    useEffect(() => {
        if (divisionLoginSuccess) {
            setDivisionLoginTrackUserDetail(divisionLoginsData.data)
        }
    }, [divisionLoginsData, divisionLoginSuccess]);

    useEffect(() => {
        if (alldevices) {
            setAdminDevices(alldevices);
        }
    }, [alldevices]);

    useEffect(() => {
        if (deviceTypeSuccess) {
            setDeviceType(deviceTypeData.data);
        }
    }, [deviceTypeSuccess, deviceTypeData]);




    return (
        <ActivityProvider>
            <div className="flex flex-row main">
                {!sidebarExpand && <Sidebar />}

                <SubSidebar />
                <div className={`sm:pl-8 pl-2 sm:ml-2  pb-4 pr-2 pt-14 bg-[#d6d6d6db] h-screen border-4 ${AppCss.dashboardMain}   w-full`}>
                    <AdminHeader />
                    <Outlet />
                </div>
            </div>
        </ActivityProvider>
    )
}



export default AppLayout;