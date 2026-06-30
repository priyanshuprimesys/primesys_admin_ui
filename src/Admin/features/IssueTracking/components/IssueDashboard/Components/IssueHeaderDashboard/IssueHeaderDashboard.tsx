import { useContext, useEffect, useState } from "react";
import { GetDashboardAnalytics } from "../../../../hooks/GetDashboardAnalytics"
// import { GlobalIssueCard } from "./GlobalIssueCard"
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { IDashboardAnalytics } from "../../../../interfaces/DashboardAnalytics";
import { IDashboardAnalyticsInitialState } from "../../../../initialState/DashboardAnalyticsInitialState";
import { UserIssueCard } from "./UserIssueCard";




export const IssueHeaderDashboard = () =>{

    const {userDetail} = useContext(UserDetailContext);
    const [globalData,setGlobalData] = useState<IDashboardAnalytics>(IDashboardAnalyticsInitialState)


    const {data,isSuccess} = GetDashboardAnalytics({
        assigneeId: userDetail.data.result.divisionId,
        page: 10,
        size: 30,
    });


    useEffect(()=>{
        if(isSuccess && data.data){
            setGlobalData(data?.data.data.result);
        }
    },[isSuccess,data]);


    return(
        <div>
            {/* <GlobalIssueCard data={globalData}/> */}
            <UserIssueCard data={globalData} />
        </div>
    )
}