import { useContext, useMemo, useState } from "react";
import { IssueContext } from "../../IssueTracking/context/IssueContext/IssueContext";
import { getCutomTimeStampToTime, splitPostTime } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { BsFillBellFill } from "react-icons/bs";
import { BsBellSlashFill } from "react-icons/bs";

interface IDashboardGraph {
    totalCount: number;
    postTime: number;
    groupName: string;
    olderGroup: boolean
}



export const DashboardIssueCountGraph = () => {

    const [showOlder, setShowOlder] = useState<boolean>(false);
    const { issueMessageData } = useContext(IssueContext);
    const issueMessageCount = useMemo(() => {
        const uniqueGroup = Array.from(new Set(issueMessageData.flat().map(item => item.groupName).filter(x => x != '')));
        const groupObjStatus: IDashboardGraph[] = [];
        uniqueGroup.forEach(group => {
            const groupCount = issueMessageData.flat().filter(item => item.groupName.includes(group));
            const newGroupCount = groupCount.sort((a, b) => splitPostTime(a.postTime) - splitPostTime(b.postTime));

            const date = Math.floor((new Date().setHours(0, 0, 0, 0) - 172800) / 1000);
            const postTime = splitPostTime(newGroupCount[0].postTime);

            if (postTime < date) {
                const groupStatusObj: IDashboardGraph = {
                    totalCount: groupCount.length,
                    groupName: group,
                    postTime: postTime,
                    olderGroup: true
                }
                groupObjStatus.push(groupStatusObj);
            } else {
                const groupStatusObj: IDashboardGraph = {
                    totalCount: groupCount.length,
                    groupName: group,
                    postTime: postTime,
                    olderGroup: false
                }
                groupObjStatus.push(groupStatusObj);
            }
        });
        return groupObjStatus;
    }, [issueMessageData]);


    const onHandleGroup = (text: string) => {
        if (text.includes("recent")) {
            setShowOlder(false);
        }
        else if (text.includes("older")) {
            setShowOlder(true);
        }
    }

    const gotoIssueTrack = () => {
        // window.location.href=`http://primesystrack.co.in/admin/issue_tracking`;
        window.location.href = `http://localhost:8061/admin/issue_tracking`;
    }



    return (
        <div className="border-[1px] max-h-[45vh] overflow-hidden pt-3 px-3 bg-white rounded-lg border-gray-100 shadow-md shadow-gray-300 h-full">
            <div className="w-full py-2 flex gap-2 items-center">
                <button className="px-2 py-2 text-white rounded-md bg-dark flex items-center gap-2" onClick={() => onHandleGroup("recent")} type="button">
                    {issueMessageCount.filter(x => x.olderGroup == false).length > 0 ? <BsFillBellFill color="#00f743" /> : <BsBellSlashFill color="#f62611" />}  Recent Groups
                </button>
                <button disabled={issueMessageCount.filter(x => x.olderGroup == true).length > 0 ? false : true} className={`${issueMessageCount.filter(x => x.olderGroup == true).length > 0 ? "bg-dark" : "bg-gray-500"} px-2 py-2 flex items-center gap-1 text-white rounded-md bg-dark`} onClick={() => onHandleGroup("older")} type="button">
                    {issueMessageCount.filter(x => x.olderGroup == true).length > 0 ? <BsFillBellFill color="#00f743" /> : <BsBellSlashFill color="#f62611" />}  Older Groups
                </button>
            </div>
            <div className="mt-5 max-h-[35vh] overflow-auto">
                {
                    !showOlder ?
                        (
                            issueMessageCount.filter(x => x.olderGroup == false).map((item, i) => (
                                <div onClick={() => gotoIssueTrack()} key={i} className="flex px-4 cursor-pointer hover:shadow-md hover:shrink-gray-500 justify-between border-[1px] border-gray-600 rounded-md mb-2  py-3">
                                    <h1 className="text-sm font-bold">{item.groupName}</h1>
                                    <div>
                                        <h2 className="text-xs font-bold">{item.totalCount}</h2>
                                        <h2 className="text-xs">{getCutomTimeStampToTime(item.postTime)}</h2>
                                    </div>
                                </div>
                            ))
                        )
                        : (
                            issueMessageCount.filter(x => x.olderGroup == true).map((item, i) => (
                                <div onClick={() => gotoIssueTrack()} key={i} className="flex px-4 cursor-pointer hover:shadow-md hover:shrink-gray-500 justify-between border-[1px] border-gray-600 rounded-md mb-2  py-3">
                                    <h1 className="text-sm font-bold">{item.groupName}</h1>
                                    <div>
                                        <h2 className="text-xs font-bold">{item.totalCount}</h2>
                                        <h2 className="text-xs">{getCutomTimeStampToTime(item.postTime)}</h2>
                                    </div>
                                </div>
                            ))
                        )
                }
            </div>

        </div>
    )
}