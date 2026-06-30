import { useContext } from "react";
import IssueHeaders from "./IssueHeaders";
import { IssueContext } from "../../context/IssueContext/IssueContext";





const IssueSidebar = () =>{
    const {totalGroups} = useContext(IssueContext);

    return(
        <div className="h-full min-w-80 max-h-[90vh] px-4 py-4 scrollbarContainer bg-dashboardSide text-gray-100 rounded-tl-md rounded-bl-md">
            <div className="flex flex-col text-center justify-center text-black">
                <h1 className="font-semibold text-gray-200 mb-3">Issue Tracking</h1>
                <div className="flex gap-3 text-white mb-3">
                    <h2 className="text-sm">Total Groups: </h2>
                    <span className="text-sm">{totalGroups}</span>
                </div>
                <hr  />
                <IssueHeaders/>
            </div>
            
        </div>
    )
}



export default IssueSidebar;