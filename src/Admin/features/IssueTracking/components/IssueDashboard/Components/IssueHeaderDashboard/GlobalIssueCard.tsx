import { IDashboardAnalytics } from "../../../../interfaces/DashboardAnalytics"

interface IssueCardInterface{
    data:IDashboardAnalytics
}


export const GlobalIssueCard: React.FC<IssueCardInterface>= ({data}) =>{

    const totalIssue = data.global_issue_status.SOFTCLOSE + data.global_issue_status.CLOSE + data.global_issue_status.INPROGRESS + data.global_issue_status.OPEN + data.global_issue_status.UNDEROBSERVATION;
    const openPercent = Math.floor((data.global_issue_status.OPEN / totalIssue) * 100);
    const closePercent = Math.floor((data.global_issue_status.CLOSE / totalIssue) * 100);
    const inprogressPercent = Math.floor((data.global_issue_status.INPROGRESS / totalIssue) * 100);
    const softClosePercent = Math.floor((data.global_issue_status.SOFTCLOSE / totalIssue) * 100);
    const underobservationPercent = Math.floor((data.global_issue_status.UNDEROBSERVATION / totalIssue) * 100);
    
    const totalPercentage = openPercent+closePercent+inprogressPercent+softClosePercent+underobservationPercent;

    const diff = Math.abs(totalPercentage - 100);


    const calcPercent = (count: number) =>
        totalIssue ? Math.floor((count / totalIssue) * 100) : 0;
    

 const statuses = [
    { label: "Open", value: data.global_issue_status.OPEN, percent: calcPercent(data.global_issue_status.OPEN) , color: "bg-yellow-500",progress:true },
    { label: "In Progress", value: data.global_issue_status.INPROGRESS, percent: calcPercent(data.global_issue_status.INPROGRESS), color: "bg-red-600",progress:true },
    { label: "Soft Close", value: data.global_issue_status.SOFTCLOSE, percent: calcPercent(data.global_issue_status.SOFTCLOSE), color: "bg-lime-600" ,progress:true},
    { label: "Close", value: data.global_issue_status.CLOSE, percent: calcPercent(data.global_issue_status.CLOSE), color: "bg-emerald-600" ,progress:true},
    { label: "Under Observation", value: data.global_issue_status.UNDEROBSERVATION, percent: calcPercent(data.global_issue_status.UNDEROBSERVATION), color: "bg-violet-600",progress:true },
    { label: "", value: "", percent: diff, color: "bg-violet-600",progress:true },
  ];    

    return(
      <div className="px-3 py-2">
        <div className="flex items-center gap-4">
          <h1 className="mb-1 font-semibold w-fit">Primesys status:</h1>
            {
              statuses.map((item,index)=>(
                <div key={index} className="flex gap-1">
                  <div className={`w-4 h-4 ${item.label != "" ? item.color : ""} rounded-full`}></div>
                  <h1 className="text-xs font-semibold">{item.label}:</h1>
                  <h3 className="text-xs">{item.value}</h3>
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