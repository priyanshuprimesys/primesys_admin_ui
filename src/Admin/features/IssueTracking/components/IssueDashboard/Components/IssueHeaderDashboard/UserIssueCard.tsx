import { useContext } from "react";
import { IDashboardAnalytics } from "../../../../interfaces/DashboardAnalytics"
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

interface IssueCardInterface{
    data:IDashboardAnalytics
}


export const UserIssueCard: React.FC<IssueCardInterface>= ({data}) =>{

  const {userDetail} = useContext(UserDetailContext);
    const totalIssue = data.user_issue_status.SOFTCLOSE + data.user_issue_status.CLOSE + data.user_issue_status.INPROGRESS + data.user_issue_status.OPEN + data.user_issue_status.UNDEROBSERVATION;
    const openPercent = Math.floor((data.user_issue_status.OPEN / totalIssue) * 100);
    const closePercent = Math.floor((data.user_issue_status.CLOSE / totalIssue) * 100);
    const inprogressPercent = Math.floor((data.user_issue_status.INPROGRESS / totalIssue) * 100);
    const softClosePercent = Math.floor((data.user_issue_status.SOFTCLOSE / totalIssue) * 100);
    const underobservationPercent = Math.floor((data.user_issue_status.UNDEROBSERVATION / totalIssue) * 100);
    
    const totalPercentage = openPercent+closePercent+inprogressPercent+softClosePercent+underobservationPercent;

    const diff = Math.abs(totalPercentage - 100);


    const calcPercent = (count: number) =>
        totalIssue ? Math.floor((count / totalIssue) * 100) : 0;
    

 const statuses = [
    { label: "Open", value: data.user_issue_status.OPEN, percent: calcPercent(data.user_issue_status.OPEN) , color: "bg-yellow-500" },
    { label: "In Progress", value: data.user_issue_status.INPROGRESS, percent: calcPercent(data.user_issue_status.INPROGRESS), color: "bg-red-600" },
    { label: "Soft Close", value: data.user_issue_status.SOFTCLOSE, percent: calcPercent(data.user_issue_status.SOFTCLOSE), color: "bg-lime-600" },
    { label: "Close", value: data.user_issue_status.CLOSE, percent: calcPercent(data.user_issue_status.CLOSE), color: "bg-emerald-600" },
    { label: "Under Observation", value: data.user_issue_status.UNDEROBSERVATION, percent: calcPercent(data.user_issue_status.UNDEROBSERVATION), color: "bg-violet-600" },
    { label: "", value: "", percent:diff , color: "bg-violet-600" },
  ];
    

    return(
      <div className="px-3 py-2">
        <div className="flex gap-4">
          <h1 className="mb-1 font-semibold w-fit">{userDetail.data.result.userName} status:</h1>
            {
              statuses.map((item,index)=>(
                <div key={index} className="flex gap-1">
                  <div className={`w-4 h-4 ${item.label != "" ? item.color : ""} rounded-full`}></div>
                  <h1 className="text-xs font-semibold">{item.label}:</h1>
                  <h3 className={`text-xs`}>{item.value}</h3>
                </div>
              ))
            }
            <h2 className="font-semibold">Total Issue: <span>{totalIssue}</span></h2>
        </div>
      
      <div style={{width: `${100}%`}} className="flex h-8 overflow-hidden border border-gray-100 rounded">
        {statuses.map((status) => (
          <div
            key={status.label}
            style={{ width: `${status.percent}%` }}
            className={`${status.color} flex items-center justify-center text-center text-white`}
          >
          </div>
        ))}
      </div>
    </div>
    )
}