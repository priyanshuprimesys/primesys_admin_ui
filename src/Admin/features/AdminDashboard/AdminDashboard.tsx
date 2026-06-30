import { useContext, useEffect, useState } from "react";
import { IDashboardAnalyticsInitialState } from "../IssueTracking/initialState/DashboardAnalyticsInitialState";
import { IDashboardAnalytics } from "../IssueTracking/interfaces/DashboardAnalytics";
import { GetDashboardAnalytics } from "../IssueTracking/hooks/GetDashboardAnalytics";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardGraph } from "./components/DashboardGraphs";
import { useGetIssueMessage } from "../IssueTracking/hooks/getIssueMessage";
import { IssueContext } from "../IssueTracking/context/IssueContext/IssueContext";


export const AdminDashboard = () => {


    const { setIssueMessageData } = useContext(IssueContext);
    const { data: issueData, isSuccess: issueSuccess } = useGetIssueMessage();
    const { userDetail } = useContext(UserDetailContext);
    const [globalData, setGlobalData] = useState<IDashboardAnalytics>(IDashboardAnalyticsInitialState);
    const { data, isSuccess } = GetDashboardAnalytics({
        assigneeId: userDetail.data.result.divisionId,
        page: 10,
        size: 30,
    });

    useEffect(() => {
        if (isSuccess) {
            setGlobalData(data.data.data.result);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (issueSuccess) {
            setIssueMessageData(issueData.data.data)
        }
    }, [issueData, issueSuccess]);


    return (
        <div className="">
            <DashboardHeader data={globalData} />
            {/* <DashboardTotalBarChart data={globalData} /> */}
            <DashboardGraph />
        </div>
    )
}

