import { IExceptionReportDetailsResponseInterface } from "../../interfaces/ExceptionInterface/ExceptionReportDetailsResponse";

export const ExceptionReportDetailsResponseInitialState:IExceptionReportDetailsResponseInterface={
    data:{
        result:[{
            tripStartKm: 0,
            tripEndKm: 0,
            tripStartTime: 0,
            tripEndTime: 0,
            tripAvgSpeed: 0,
            tripMaxSpeed: 0,
            distanceCoverTrip: 0,
            tripDistanceTobeCoverKm: 0,
            reportOfTheDay: 0,
            actualStartTime: 0,
            actualEndTime: 0,
            deviceImei: 0,
            deviceName: "",
            allocatedTrips: 0,
            actualTrips: 0,
            deviceNo: 0,
            sectionName: "",
            remark: "",
            tripList: [{
                id: "",
                tripStartKm: 0,
                tripEndKm: 0,
                tripStartTime: 0,
                tripEndTime: 0,
                tripMaxSpeed: 0,
                tripAvgSpeed: 0,
                tripActualStartKm: 0,
                tripActualEndKm: 0,
                tripActualStartTime: 0,
                tripActualEndTime: 0,
                distanceCoverTrip: 0,
                tripDistanceTobeCoverKm: 0,
                distanceCoverPoint: 0,
                reportOfTheDay: 0,
                deviceStartTime: 0,
                deviceOffTime: 0,
                deviceOnTrackStartTime: 0,
                deviceOffTrackStartTime: 0,
                deviceImei: 0,
                deviceName: "",
                deviceLocationCount: 0,
                deviceLocationOnTrackCount: 0,
                deviceTripStartBatteryStatus: 0,
                deviceTripEndBatteryStatus: 0,
                remark: "",
                tripNo: 0
            }]
        }]
    },
    success:false
}