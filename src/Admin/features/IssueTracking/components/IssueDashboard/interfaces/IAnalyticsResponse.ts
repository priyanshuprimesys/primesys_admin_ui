import { SuccessInterface } from "../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface"

export interface IAnalyticsInterface{
    assigneeStatusCounts:any,
    todayStatusCounts: any,
    priorityStatusCounts: any,
    reopenedIssuesCount: any,
    slaBreachedCount: any,
    popularTags: any,
    overdueIssueCount: any,
    avgTimeToCloseSeconds: any
    statusCountsGlobal:{
        [key: string]: number
    },
    priorityStatusCountsGlobal:[
        {
            priority: string,
            status: string,
            count: number
        }
    ],
    slaBreachedCountGlobal: number,
    statusTrendPerDay: any,
    statusTrendPerWeek: any,
    statusTrendPerMonth: any,
    name: string,
    divisionWiseCounts: any
    pagedLatestIssues: {
        content: [],
        totalElements: number,
        totalPages: number,
        page: number,
        size: number
    }
}




export interface IAnalyticsDetailResponseInterface extends SuccessInterface{
    data:{
        result: IAnalyticsInterface
    },
    errors:{
        message:string
    }
}
