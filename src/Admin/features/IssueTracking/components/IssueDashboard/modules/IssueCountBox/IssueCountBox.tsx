import { useContext, useState } from "react";
import { GetIssueAnalyticsHook } from "../../hooks/GetIssueAnalyticsHook"
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { IAnalyticsRequest } from "../../interfaces/IAnalyticsRequest";
import { MdOutlinePendingActions } from "react-icons/md";




export const IssueCountBox = () =>{

    const {userDetail} = useContext(UserDetailContext);
    const [issueRequest,_setIssueRequest] = useState<IAnalyticsRequest>({
        assigneeId: userDetail.data.result.divisionId,
        page: 0,
        size:20
    });

    const {} = GetIssueAnalyticsHook(issueRequest);

    return(
        <div className="flex flex-wrap items-center px-1 py-1">
            <div className="flex items-center justify-center flex-shrink-0 w-1/4 gap-3 px-4 py-6 bg-white border-2 border-gray-300 rounded-md shadow-sm">
                <div className="px-2 py-2 border-2 border-gray-400 rounded-full cursor-pointer hover:border-gray-800">
                    <MdOutlinePendingActions size={20} color="red" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-medium text-black">12</h1>
                    <span className="font-mono text-xs text-gray-500">Open Tasks</span>
                </div>
            </div>
            {/* second */}
            <div className="flex items-center justify-center w-1/4 gap-3 px-4 py-6 bg-white border-2 border-gray-300 rounded-md shadow-sm">
                <div className="px-2 py-2 border-2 border-gray-400 rounded-full cursor-pointer hover:border-gray-800">
                    <MdOutlinePendingActions size={20} color="red" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-medium text-black">12</h1>
                    <span className="font-mono text-xs text-gray-500">InProgress Tasks</span>
                </div>
            </div>
            {/* Third */}
            <div className="flex items-center justify-center w-1/4 gap-3 px-4 py-6 bg-white border-2 border-gray-300 rounded-md shadow-sm">
                <div className="px-2 py-2 border-2 border-gray-400 rounded-full cursor-pointer hover:border-gray-800">
                    <MdOutlinePendingActions size={20} color="red" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-medium text-black">12</h1>
                    <span className="font-mono text-xs text-gray-500">Pending Tasks</span>
                </div>
            </div>
            {/* Fourth */}
            <div className="flex items-center justify-center w-1/4 gap-3 px-4 py-6 bg-white border-2 border-gray-300 rounded-md shadow-sm">
                <div className="px-2 py-2 border-2 border-gray-400 rounded-full cursor-pointer hover:border-gray-800">
                    <MdOutlinePendingActions size={20} color="red" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-medium text-black">12</h1>
                    <span className="font-mono text-xs text-gray-500">Pending Tasks</span>
                </div>
            </div>
        </div>
    )
}