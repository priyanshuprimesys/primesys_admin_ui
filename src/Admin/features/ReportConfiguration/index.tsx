
import {
    Outlet,
    useParams,
} from "react-router-dom";
import { ReportDashboard } from "./components/ReportDashboard";


export const ReportConfiguration = () => {

    const { id } = useParams();

    return (
        <>
            {!id && <ReportDashboard />}
            <Outlet />
        </>
    );
};
