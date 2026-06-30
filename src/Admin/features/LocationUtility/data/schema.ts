export interface DeviceLocation {
    latDirection: string;
    lonDirection: string;
    lat: number;
    lon: number;
    speed: number;
    timestamp: number;
    isBlind: boolean;
    blindLocationGetTimestamp: number;
    featureDetail: string,
    rdpsDistanceDiff: number
    voltageLevel: string,
    rdpsKm: string,
    gsmSignalStrength: string
}
export interface GeoLocation {
    type: string;
    coordinates: [number, number];
}

export interface Status {
    gpsRealTime: number;
    gpsPosition: number;
    lonDirection: string;
    latDirection: string;
    course: number;
}


export interface NearestRdps {
    geoLocation: GeoLocation;
    featureDetail: string;
    kilometer: number;
    distance: number;
    distanceDiff: number;
}



export interface IDeviceLocationRequest {
    deviceImei: number,
    startTime: number,
    endTime: number
}


export interface IDeviceDestroyRequest {
    imei: number,
    timestamp: number[],
    divisionId: string
}

export interface DeviceLocationResponse {
    data: {
        result: DeviceLocation[]
    },
    code: number,
    success: boolean,
    message: string
}
export interface DeviceLocationDestroyResponse {
    data: {
        result: string
    },
    code: number,
    success: boolean,
    message: string
}
