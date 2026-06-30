export interface IReportGenerateRequestInterface{
    division_id?: string,
    device_type_id: number,
    report_day: number,
    shift_type: number,
    device_list?: string,
    user_id: string,
    trip_wise_report: boolean
}