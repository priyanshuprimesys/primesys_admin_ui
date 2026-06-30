export interface DivisionReportLogEntity {
    id: string;
    divisionId: string;

    deviceTypeId: number;

    generatedAt: number;

    /**
     * Maximum trip end time in division
     */
    tripMaxTime: number;

    /**
     * Stored in seconds
     */
    tripLockTime: number;

    reportDate: number;

    status: StatusEnum;

    reports: DivisionTripReport[];
}

export interface ReportLogResponse {
    data: {
        result: DivisionReportLogEntity[];
    };
    message: string;
    code: number;
    success: boolean;
}


export enum StatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}


export interface DivisionTripReport {
    tripStartKm: number;
    tripEndKm: number;

    tripStartTime: number;
    tripEndTime: number;

    tripMaxSpeed: number;
    tripAvgSpeed: number;

    distanceCoverTrip: number;
    tripDistanceTobeCoverKm: number;

    reportOfTheDay: number;

    tripActualStartKm: number;
    tripActualEndKm: number;

    actualStartTime: number;
    actualEndTime: number;

    deviceImei: number;
    deviceName: string;

    allocatedTrips: number;
    actualTrips: number;

    deviceNo: number;

    sectionName: string;

    deviceTripStartBatteryStatus: number;
    deviceTripEndBatteryStatus: number;

    isBlind: boolean;

    remark: string;

    tripList: TripReportStatus[];

    deviceTypeId: number;

    shiftType: number;

    tripMaxDuration: number;

    tripMaxTimestamp: number;

    status: TripStatus[];

    createdAt: number;

    walkingDistance: number;
}


export interface TripReportStatus {
    id: string;

    tripStartKm: number;
    tripEndKm: number;

    tripStartTime: number;
    tripEndTime: number;

    tripMaxSpeed: number;
    tripAvgSpeed: number;

    tripActualStartKm: number;
    tripActualEndKm: number;

    tripActualStartTime: number;
    tripActualEndTime: number;

    distanceCoverTrip: number;
    tripDistanceTobeCoverKm: number;
    distanceCoverPoint: number;

    reportOfTheDay: number;

    deviceStartTime: number;
    deviceOffTime: number;

    deviceOnTrackStartTime: number;
    deviceOffTrackStartTime: number;

    deviceImei: number;
    deviceName: string;

    deviceNo: number;

    tripMaxDuration: number;
    tripMaxTimestamp: number;

    deviceLocationCount: number;
    deviceLocationOnTrackCount: number;

    deviceTripStartBatteryStatus: number;
    deviceTripEndBatteryStatus: number;

    remark: string;

    deviceSosList: DeviceSos[];

    stoppageList: DeviceStoppage[];

    status: TripStatus[];

    tripNo: number;

    deviceTypeId: number;

    shiftType: number;

    createdAt: number;

    tripCount: number;

    divisionId: string;

    activity: string;

    tripReportOffTrackStatuses: TripReportOffTrackStatus[];

    stoppageStatuses: DeviceStoppageStatus[];
}


export interface DeviceSos {
    _id: string;

    deviceImei: number;

    status: string;

    voltageLevel: string;

    gsmSignalStrength: string;

    timestamp: number;
}

export interface DeviceSos {
    _id: string;

    deviceImei: number;

    status: string;

    voltageLevel: string;

    gsmSignalStrength: string;

    timestamp: number;
}


export interface DeviceStoppage {
    stoppageRdpsKm: number;

    stoppageRdpsDistance: number;

    stoppageRdpsDetails: string;

    stoppageTime: number;

    stoppageStartTime: number;

    geoLocation: GeoLocation;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}


export interface TripStatus {
    inOutStatus: string;

    timestamp: number;

    allocatedLc: string;

    location: string;

    distance: number;

    timeDeviation: number;
}


export interface TripReportOffTrackStatus {
    totalOffTrackTime: number;

    offTrackStart: number;

    offTrackEnd: number;
}


export interface DeviceStoppageStatus {
    stoppageStartTime?: number;

    stoppageEndTime?: number;

    stoppageStartKm?: number;

    stoppageEndKm?: number;

    remark?: string;

    fenceExitTime?: number;
}