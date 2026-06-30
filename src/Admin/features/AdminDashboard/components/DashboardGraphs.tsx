import {useContext, useEffect, useMemo, useState } from "react";
import { GetAllIssues } from "../../IssueTracking/hooks/GetAllIssuesHook";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { splitPostTime } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { timeDurationUpto } from "../../../../utils/hooks/customHooks/CustomHooks";
import { DashboardIssueCountGraph } from "./DashboardIssueCountGraph";
import { useGetIssueDataById } from "../../IssueTracking/hooks/getIssueDataById";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import Loader from "../../../../global/components/loader/Loader";
import { IssueContext } from "../../IssueTracking/context/IssueContext/IssueContext";



interface BarChartInterface{
    name: string,
    open: number,
    inprogress: number,
    underobservation: number,
    softclose: number,
    close: number
}

interface CategoryCountInterface{
    name:string;
    count:number;
}



export const DashboardGraph = () =>{

    const {userDetail} = useContext(UserDetailContext);
    const {setUserPerMessages} = useContext(IssueContext);
    const {data,isSuccess} = GetAllIssues();
    const {data:userData,isSuccess:userSuccess} = useGetIssueDataById(userDetail.data?.result?.divisionId);
    const [issueStatus,setIssueStatus] = useState<string>("today");
    const [showLoading,setShowLoading] = useState<boolean>(true);


    const userIssueCount = useMemo(() => {
        if (!isSuccess || !data) return [];

        const filteredIssues: BarChartInterface[] = [];
        const users = new Set(data.data.data.map(item => item.assigneeName));
        const usersArray = Array.from(users).sort();

        usersArray.forEach(user => {
            const issues = data.data.data.filter(issue => issue.assigneeName.includes(user));

            const open = issues.filter(item => item.issueStatus === "OPEN").length;
            const close = issues.filter(item => item.issueStatus === "CLOSE").length;
            const softclose = issues.filter(item => item.issueStatus === "SOFTCLOSE").length;
            const under = issues.filter(item => item.issueStatus === "UNDEROBSERVATION").length;
            const inprogress = issues.filter(item => item.issueStatus === "INPROGRESS").length;

            filteredIssues.push({
                name: issues[0]?.assigneeName,
                open,
                inprogress,
                underobservation: under,
                softclose,
                close
            });
        });

        return filteredIssues;
    }, [isSuccess, data]);

    const userTodayIssueCount = useMemo(() => {
        if (!userSuccess || !userData) return [];

        const filteredIssues: BarChartInterface[] = [];
        const users = new Set(userData.data.data.map(item => item.assigneeName));
        const usersArray = Array.from(users).sort();
        const today12 = timeDurationUpto(issueStatus);

        if(today12){
            usersArray.forEach(user => {
                const issues = userData.data.data.filter((item) => splitPostTime(item.createdAt) > today12 || splitPostTime(item.updatedAt) > today12).filter(issue => issue.assigneeName.includes(user));
                const open = issues.filter(item => item.issueStatus === "OPEN").length;
                const close = issues.filter(item => item.issueStatus === "CLOSE").length;
                const softclose = issues.filter(item => item.issueStatus === "SOFTCLOSE").length;
                const under = issues.filter(item => item.issueStatus === "UNDEROBSERVATION").length;
                const inprogress = issues.filter(item => item.issueStatus === "INPROGRESS").length;

                filteredIssues.push({
                    name: user,
                    open,
                    inprogress,
                    underobservation: under,
                    softclose,
                    close
                });
            });
        }

        return filteredIssues;
    }, [isSuccess, data,issueStatus]);




    const allUserTodayIssueCount = useMemo(() => {
        if (!isSuccess || !data) return [];

        const filteredIssues: BarChartInterface[] = [];
        const users = new Set(data.data.data.map(item => item.assigneeName));
        const usersArray = Array.from(users).sort();
        const today12 = timeDurationUpto(issueStatus);

        if(today12){
            usersArray.forEach(user => {
                const issues = data.data.data.filter((item) => splitPostTime(item.createdAt) > today12 || splitPostTime(item.updatedAt) > today12).filter(issue => issue.assigneeName.includes(user));
                const open = issues.filter(item => item.issueStatus === "OPEN").length;
                const close = issues.filter(item => item.issueStatus === "CLOSE").length;
                const softclose = issues.filter(item => item.issueStatus === "SOFTCLOSE").length;
                const under = issues.filter(item => item.issueStatus === "UNDEROBSERVATION").length;
                const inprogress = issues.filter(item => item.issueStatus === "INPROGRESS").length;

                filteredIssues.push({
                    name: user,
                    open,
                    inprogress,
                    underobservation: under,
                    softclose,
                    close
                });
            });
        }

        return filteredIssues;
    }, [isSuccess, data,issueStatus]);

    const categoryGraph = useMemo(()=>{
        if(!isSuccess || !data) return;
        const categoryCountArr: CategoryCountInterface[] = [];
        const categories = Array.from(new Set(data.data.data.map(item=> item.category))).filter(item => item != "");
        categories.forEach(category => {
            const categories = data.data.data.filter(cat => cat.category.includes(category));
            const categoryObj: CategoryCountInterface = {
                name: category,
                count: categories.length
            };
            categoryCountArr.push(categoryObj);
        });
        return categoryCountArr;
    },[isSuccess,data]);
    
    const options: Highcharts.Options = {
        chart: {
            type: "pie",
            height: 400,
            borderRadius: 22,
            backgroundColor:"white",
            shadow:true
        },
        title: {
            text: "Category Count",
        },
        tooltip: {
            pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
        },
        accessibility: {
            point: {
            valueSuffix: "%",
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.y}",
                },  
            },
        },
        series: [
            {
                type:"pie",
                name: "Count",
                data: categoryGraph?.map((item) => ({
                    name: item.name,
                    y: item.count,
                })),
            },
        ],
         credits:{
            enabled: false
        }
    };

    const lineOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: 400,
                borderRadius:22,
                shadow:true,
            },
            title: {
                text: "Issues per User",
            },
            xAxis: {
                categories: allUserTodayIssueCount.map(item => item.name),
                title: { text: "Users" },
            },
            yAxis: {
                min: 0,
                title: { text: "Issue Count" },
                stackLabels: {
                    enabled: true,
                },
            },
            tooltip: {
                shared: true,
                pointFormat:
                "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b><br/>",
            },
            legend: {
                align: "center",
                verticalAlign: "bottom",
            },
            plotOptions: {
            column: {
                stacking: "normal", 
                dataLabels: {
                    enabled: true,
                },
                pointWidth: 80,
                pointPadding: 0.19,
                groupPadding: 0.05
            },
        },
            series: [
                {
                type: "column",
                name: "Open",
                data: allUserTodayIssueCount.map(item => item.open),
                color: "#FF4C4C",
                },
                {
                type: "column",
                name: "In Progress",
                data: allUserTodayIssueCount.map(item => item.inprogress),
                color: "#FFA500",
                },
                {
                type: "column",
                name: "Under Observation",
                data: allUserTodayIssueCount.map(item => item.underobservation),
                color: "#1E90FF",
                },
                {
                type: "column",
                name: "Soft Close",
                data: allUserTodayIssueCount.map(item => item.softclose),
                color: "#9370DB",
                },
                {
                type: "column",
                name: "Close",
                data: allUserTodayIssueCount.map(item => item.close),
                color: "#32CD32",
                },
            ],
             credits:{
            enabled: false
        }
    };
    const userIdlineOptions: Highcharts.Options = {
            chart: {
                type: "column",
                height: 400,
                borderRadius:22,
                shadow:true,
            },
            title: {
                text: "Issues per User",
            },
            xAxis: {
                categories: userTodayIssueCount.map(item => item.name),
                title: { text: "Users" },
            },
            yAxis: {
                min: 0,
                title: { text: "Issue Count" },
                stackLabels: {
                    enabled: true,
                },
            },
            tooltip: {
                shared: true,
                pointFormat:
                "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b><br/>",
            },
            legend: {
                align: "center",
                verticalAlign: "bottom",
            },
            plotOptions: {
            column: {
                stacking: "normal", 
                dataLabels: {
                    enabled: true,
                },
                pointWidth: 80,
                pointPadding: 0.19,
                groupPadding: 0.05
            },
        },
            series: [
                {
                type: "column",
                name: "Open",
                data: userTodayIssueCount.map(item => item.open),
                color: "#FF4C4C",
                },
                {
                type: "column",
                name: "In Progress",
                data: userTodayIssueCount.map(item => item.inprogress),
                color: "#FFA500",
                },
                {
                type: "column",
                name: "Under Observation",
                data: userTodayIssueCount.map(item => item.underobservation),
                color: "#1E90FF",
                },
                {
                type: "column",
                name: "Soft Close",
                data: userTodayIssueCount.map(item => item.softclose),
                color: "#9370DB",
                },
                {
                type: "column",
                name: "Close",
                data: userTodayIssueCount.map(item => item.close),
                color: "#32CD32",
                },
            ],
             credits:{
            enabled: false
        }
    };

    const userIssueOptions:Highcharts.Options = {
        chart: {
            type: "column",
            height: 600,
            borderRadius:22,
            shadow:true
        },
        title: {
            text: "Issues per User",
        },
        xAxis: {
            categories: userIssueCount.map(item => item.name),
            title: { text: "Users" },
        },
        yAxis: {
            min: 0,
            title: { text: "Issue Count" },
            stackLabels: {
            enabled: true,
            },
        },
        legend: {
            align: "center",
            verticalAlign: "bottom",
        },
        tooltip: {
            shared: true,
            pointFormat: "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b><br/>",
        },
        plotOptions: {
            column: {
                stacking: "normal", 
                dataLabels: {
                    enabled: true,
                },
                pointWidth: 80,
                pointPadding: 0.19,
                groupPadding: 0.05
            },
        },
        series: [
            {
                type:"column",
                name: "Open",
                color:"#ca8a04",
                data: userIssueCount.map(item => item.open),
            },
            {
                type:"column",
                name: "In Progress",
                color:"#dc2626",
                data: userIssueCount.map(item => item.inprogress),
            },
            {
                type:"column",
                name: "Under Observation",
                color:"#7c3aed",
                data: userIssueCount.map(item => item.underobservation),
            },
            {
                type:"column",
                name: "Soft Close",
                color:"#65a30d",
                data: userIssueCount.map(item => item.softclose),
            },
            {
                type:"column",
                name: "Close",
                color:"#059669",
                data: userIssueCount.map(item => item.close),
            },
        ],
        credits:{
            enabled: false
        }
    };
    
    const onChageIssueDuration = (duration:string)=>{
        setIssueStatus(duration);
    }

    useEffect(()=>{
        setTimeout(() => {
            setShowLoading(false);
        }, 1200);
    },[]);

    useEffect(()=>{
        if(userSuccess){
            setUserPerMessages(userData.data.data)
        }
    },[userSuccess]);


    return(
        <div className="h-full px-4 py-4">
            {
                showLoading ?
                <div className="w-full h-full">
                    <Loader/>
                </div>
                :
                <>
                    <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
                        <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-2">
                            <div>
                                <h1 className="mb-3 text-base font-bold">Issue Groups</h1>
                                <DashboardIssueCountGraph/>
                            </div>
                            <div className="w-full rounded-2xl">
                                <h1 className="mb-2 text-base font-semibold">Category Graph</h1>
                                <HighchartsReact highcharts={Highcharts} options={options} />
                            </div>
                        </div>
                

                        <div className="w-full">
                            <h1 className="mb-2 text-base font-semibold">Today Status</h1>
                            <div className="flex gap-2 mb-2">
                                <button type="button" onClick={()=> onChageIssueDuration("today")} className="px-4 bg-primaryDark text-white rounded-md py-2 border-[1px] border-white">Today</button>
                                <button type="button" onClick={()=> onChageIssueDuration("week")} className="px-4 bg-primaryDark text-white rounded-md py-2 border-[1px] border-white">Week</button>
                                <button type="button" onClick={()=> onChageIssueDuration("month")} className="px-4 bg-primaryDark text-white rounded-md py-2 border-[1px] border-white">Month</button>
                                {/* <Input max={formattedToday} value={startDate} onChange={(e)=> setStartDate(e.target.value)} type="date" variant='filled' placeholder='Outline' /> */}
                                {/* <Input max={formattedToday} value={endDate} onChange={(e)=> setEndDate(e.target.value)} type="date" variant='filled' placeholder='Outline' /> */}
                            </div>
                            {userDetail.data.result.roleId === 19 ? <HighchartsReact highcharts={Highcharts} options={userIdlineOptions} /> :  <HighchartsReact highcharts={Highcharts} options={lineOptions} />}
                        </div>
                    </div>

                    <div className=" w-full h-[76vh]">
                        {userDetail.data.result.roleId != 19 && <HighchartsReact highcharts={Highcharts} options={userIssueOptions} />}
                    </div>
                </>
            }
            
            
        </div>
  
    )
}