import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteTripSummary, fetchTripSummaryReport, regenerateTripSummary } from "./api"
import { TripReportSummaryRequest, TripSummaryRegenerateRequest } from "./schema"
import { toast } from "react-toastify"



const BASE_KEY = "TRIP_SUMMARY_REPORT"




export const useFetchTripSummaryReport = (request: TripReportSummaryRequest) => {
    return useQuery({
        queryKey: [BASE_KEY, request.startDateTime, request.endDateTime],
        queryFn: () => fetchTripSummaryReport(request),
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!request.divisionId && !!request.startDateTime && !!request.endDateTime
    })
}

export const useRegenerateTripSummary = () => {
    return useMutation({
        mutationKey: ["REGENERATE_TRIP_SUMMARY"],
        mutationFn: (request: TripSummaryRegenerateRequest) => regenerateTripSummary(request),
        retry: false,
        onSuccess: () => {
            toast.success("Report regenerated successfully")
        }
    })
}


export const useDeleteTripSummary = () => {
    return useMutation({
        mutationKey: ["DELETE_TRIP_SUMMARY"],
        mutationFn: (request: TripSummaryRegenerateRequest) => deleteTripSummary(request),
        retry: false,
        onSuccess: () => {
            toast.success("Report deleted successfully")
        }
    })
}
