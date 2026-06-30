import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../contexts/AuthLayout/AuthenticationContext/AuthenticationContext";
import AuthService from "../api/services/AuthService";
import Loader from "../global/components/loader/Loader";

// Route Components
import { Suspense } from "react";
import RouteError from "../global/Errors/ErrorComponent/RouteError";
import LoginLayout from "../views/auth/layouts/auth/AuthLayout";
import AdminLayout from "../views/auth/layouts/app/AppLayout";
import PrivacyPolicy from "../Admin/pages/PrivacyPolicy/index";

import Dashboard from "../Admin/pages/Dashboard/Dashboard";
import AllDivisionDevices from "../Admin/pages/AllDivisionDevices/AllDivisionDevices";
import DeviceConfiguration from "../Admin/pages/DeviceConfiguration/DeviceConfiguration";
import DeviceExchange from "../Admin/pages/DeviceExchange/DeviceExchange";
import DeviceSubscriptionModule from "../Admin/pages/DeviceSubscription/DeviceSubscription";
import { HirearchyModule } from "../Admin/pages/HirearchyModule/HirearchyModule";
import KeymanBeatModule from "../Admin/features/KeymanBeatModule";
import AdminUtility from "../Admin/pages/AdminUtility/AdminUtility";
import RdpsUtility from "../Admin/features/AdminUtility/features/RdpsUtility/RdpsUtility";
import { RdpsUtilityPage } from "../Admin/pages/AdminUtility/RdpsUtility/rdps-utility";
import { IOTDataModule } from "../Admin/pages/IOTData/IOTData";
import { ReportPermissionPage } from "../Admin/pages/ReportPermissionPage";
import IssueTrackPage from "../Admin/pages/IssueTrackPage/IssueTrackPage";
import LogoutService from "../api/services/LogoutService";
import { DeviceInspectionDashboard, DeviceInspectionEditView } from "../Admin/features/DeviceInspection/DeviceInspectionIndex";

const PrivateRoute = ({ isAuthenticated, element }: any) => {
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const PublicRoute = ({ isAuthenticated, element }: any) => {
  return !isAuthenticated ? element : <Navigate to="/admin" replace />;
};

const AppRouter = () => {
  const { isAuthenticated, SetIsAuthenticated } = useContext(AuthenticationContext);
  const [showLoader, setShowLoader] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticationToken = await AuthService.checkAuthUser();
      SetIsAuthenticated(!!authenticationToken);
      setShowLoader(false);
    };
    checkAuthentication();
  }, []);

  if (showLoader) return <Loader />;

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Public Route: Login */}
          <Route
            path="/"
            element={<PublicRoute isAuthenticated={isAuthenticated} element={<LoginLayout />} />}
            errorElement={<RouteError />}
          />

          {/* Public Route: Privacy Policy */}
          <Route
            path="/privacy"
            element={<PublicRoute isAuthenticated={isAuthenticated} element={<PrivacyPolicy />} />}
            errorElement={<RouteError />}
          />

          {/* Private Routes (Admin) */}
          <Route
            path="/"
            element={<PrivateRoute isAuthenticated={isAuthenticated} element={<AdminLayout />} />}
            errorElement={<RouteError />}
          >

            {/* Admin Dashboard */}
            <Route path="admin" element={<Dashboard />} errorElement={<RouteError />} />

            {/* All Division Devices */}
            <Route
              path="admin/all_devices"
              element={<AllDivisionDevices />}
              errorElement={<RouteError />}
            />

            {/* Issue Tracking */}
            <Route
              path="admin/issue_tracking"
              element={<IssueTrackPage />}
              errorElement={<RouteError />}
            />

            {/* Device Configuration */}
            <Route
              path="admin/device_configuration"
              element={<DeviceConfiguration />}
              errorElement={<RouteError />}
            />

            {/* Beat Module */}
            <Route
              path="admin/beat_module"
              element={<KeymanBeatModule />}
              errorElement={<RouteError />}
            />

            {/* Device Exchange */}
            <Route
              path="admin/device_exchange"
              element={<DeviceExchange />}
              errorElement={<RouteError />}
            />

            {/* Hirearchy Module */}
            <Route
              path="admin/hirearchy_module"
              element={<HirearchyModule />}
              errorElement={<RouteError />}
            />

            {/* Device Subscription */}
            <Route
              path="admin/device_subscription"
              element={<DeviceSubscriptionModule />}
              errorElement={<RouteError />}
            />

            {/* Admin Utility */}
            <Route path="admin/admin_utility" element={<AdminUtility />} errorElement={<RouteError />}>
              <Route path="rdps" element={<RdpsUtility />} errorElement={<RouteError />} />
            </Route>

            {/* RDPS Utility */}
            <Route
              path="admin/rdps_utility"
              element={<RdpsUtilityPage />}
              errorElement={<RouteError />}
            />

            {/* IOT Data */}
            <Route
              path="admin/admin_iot_data"
              element={<IOTDataModule />}
              errorElement={<RouteError />}
            />

            {/* Device Inspection (Parent + Nested Detail) */}
            <Route
              path="admin/device_inspection"
              element={<DeviceInspectionDashboard />}
              errorElement={<RouteError />}
            >
              <Route
                path="detail"
                element={<DeviceInspectionEditView />}
                errorElement={<RouteError />}
              />
            </Route>

            {/* Reports and Permission */}
            <Route
              path="admin/reports_permission"
              element={<ReportPermissionPage />}
              errorElement={<RouteError />}
            />

            {/* Logout */}
            <Route
              path="admin/logout"
              element={<LogoutService />}
              errorElement={<RouteError />}
            />

          </Route>

          {/* Fallback Error Page */}
          <Route path="*" element={<RouteError />} errorElement={<RouteError />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
