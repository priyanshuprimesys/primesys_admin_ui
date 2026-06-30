import { IDashboardAnalytics } from "../../IssueTracking/interfaces/DashboardAnalytics"
import { TbProgress } from "react-icons/tb";
import { FaDoorOpen } from "react-icons/fa";
import { PiEyeClosedFill } from "react-icons/pi";
import { IoHourglassOutline } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";


interface IssueCardInterface{
    data:IDashboardAnalytics
}

export const DashboardHeader: React.FC<IssueCardInterface> = ({data}) =>{

    const totalIssue = data.global_issue_status.SOFTCLOSE + data.global_issue_status.CLOSE + data.global_issue_status.INPROGRESS + data.global_issue_status.OPEN + data.global_issue_status.UNDEROBSERVATION;
    // const openCount = data.global_issue_status.OPEN;
    // const inprogressCount = data.global_issue_status.INPROGRESS;
    // const underobservationCount = data.global_issue_status.UNDEROBSERVATION;
    // const softcloseCount = data.global_issue_status.SOFTCLOSE;
    // const closeCount = data.global_issue_status.CLOSE;
    // const openPercent = Math.floor((data.global_issue_status.OPEN / totalIssue) * 100);
    // const closePercent = Math.floor((data.global_issue_status.CLOSE / totalIssue) * 100);
    // const inprogressPercent = Math.floor((data.global_issue_status.INPROGRESS / totalIssue) * 100);
    // const softClosePercent = Math.floor((data.global_issue_status.SOFTCLOSE / totalIssue) * 100);
    // const underobservationPercent = Math.floor((data.global_issue_status.UNDEROBSERVATION / totalIssue) * 100);
    



    const calcPercent = (count: number) => totalIssue ? Math.floor((count / totalIssue) * 100) : 0;
    

    const statuses = [
        { label: "Total Issue", value: totalIssue, percent: "100",progress:true ,shadow:"hover:shadow-primaryDark"},
        { label: "Open", value: data.global_issue_status.OPEN, percent: calcPercent(data.global_issue_status.OPEN) , color: "bg-yellow-500",progress:true ,shadow:"hover:shadow-yellow-500",icon: <FaDoorOpen size={19} className="text-yellow-600" /> },
        { label: "In Progress", value: data.global_issue_status.INPROGRESS, percent: calcPercent(data.global_issue_status.INPROGRESS), color: "bg-red-600",progress:true ,shadow:"hover:shadow-red-500",icon:<TbProgress size={19} className="text-red-600"/>},
         { label: "Under Observation", value: data.global_issue_status.UNDEROBSERVATION, percent: calcPercent(data.global_issue_status.UNDEROBSERVATION), color: "bg-violet-600",progress:true, shadow:"hover:shadow-violet-500", icon: <IoHourglassOutline size={19} className="text-violet-600" /> },
        { label: "Soft Close", value: data.global_issue_status.SOFTCLOSE, percent: calcPercent(data.global_issue_status.SOFTCLOSE), color: "bg-lime-600" ,progress:true,shadow:"hover:shadow-lime-500",icon:<RiEdit2Fill size={19} className="text-lime-600"/>},
        { label: "Close", value: data.global_issue_status.CLOSE, percent: calcPercent(data.global_issue_status.CLOSE), color: "bg-emerald-600" ,progress:true, shadow:"hover:shadow-emerald-500",icon:<PiEyeClosedFill size={20} className="text-emerald-600"/>},
    ];  


    return(
        <div>
            <div className="flex flex-wrap gap-2">
                {
                    statuses.map((item,index)=>(
                        <div key={index} className={`w-full sm:w-[30vw] h-36 flex flex-col justify-between md:w-[20vw] lg:w-[15vw] overflow-hidden py-4 px-4 bg-white border-[1.5px] cursor-pointer border-gray-100 rounded-md shadow-sm shadow-gray-600 hover:shadow-md transition-all duration-100 ease-in ${item.shadow}`}>
                            <div className="flex justify-between">
                                <p className="text-base font-semibold">{item.label}</p>
                                {
                                    item.color ?
                                    // <div className={`w-4 h-4 rounded-full ${item.icon}`} />
                                    <div>{item.icon}</div>
                                    :
                                    <img src="logo.png" alt="Primesys Logo" className="w-6 h-6 rounded-full" />
                                }
                                
                            </div>
                            <div className="mt-4">
                                <p className="text-lg font-semibold">{item.value}</p>
                                <p className="text-xs font-light">{item.percent+"%"+" of total issue upto "+ new Date().toLocaleDateString([],{day:"2-digit",month:'2-digit',year:"2-digit"})}</p>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}