import { lazy } from "react";



export const DeviceInspectionDashboard = lazy(()=> import('./pages/InspectionReport'));
export const DeviceInspectionEditView = lazy(()=> import('./pages/InspectionDetail'));