import { IDashboardAnalytics } from "../interfaces/DashboardAnalytics";




export const IDashboardAnalyticsInitialState: IDashboardAnalytics={
    global_issue_status: {
        SOFTCLOSE: 0,
        CLOSE: 0,
        UNDEROBSERVATION: 0,
        INPROGRESS: 0,
        OPEN: 0
    },
    global_priority: {
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
    },
    global_category: [],
    global_tags: [],
    user_issue_status: {
        SOFTCLOSE: 0,
        CLOSE: 0,
        UNDEROBSERVATION: 0,
        INPROGRESS: 0,
        OPEN: 0
    },
    user_priority: {
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
    },
    user_category: [],
    user_tags: [],
    filter_issue_count: [],
    combination_counts: [],
    raw_issues: []
}