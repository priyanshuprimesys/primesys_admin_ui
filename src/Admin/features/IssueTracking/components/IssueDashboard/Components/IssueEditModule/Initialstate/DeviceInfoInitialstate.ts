import { IDeviceInfoDetailResponseInterface, IDeviceInfoInterface } from "../Interface/DeviceInfoDetailResponse";



export const DeviceInfoInitialState:IDeviceInfoInterface = {
    id: "",
    deviceImei: 0,
    commands:{
        latestFnSet: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestFn: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestSosSet: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestSos: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestHbtSet: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestHbt: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestTimerSet: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestTimer: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestPeriodSet: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestPeriod: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestStatus: {
            command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        },
        latestParam: {
              command: "",
            timestamp: 0,
            deliveredMsg: "",
            loginName: "",
            deviceResponse: "",
            deviceResponseTime: ""
        }
    },
    deviceInfo: {
        deviceImei: 0,
        reportTimeMargin: 0,
        reportDistMargin: 0,
        onTrackMargin: 0,
        deviceName: "",
        deviceSimNo: "",
        deviceSimImeiNo: "",
        deviceNo: 0,
        reportEnable: false
    },
    tripInfo: [],
    location: {
        id: "",
        deviceImei: 0,
        geoLocation: {
            type: "",
            coordinates: [0,0]
        },
        speed: 0,
        timestamp: 0,
        status: {
            gpsRealTime: 0,
            gpsPosition: 0,
            lonDirection: "",
            latDirection: "",
            course: 0
        },
        satelliteNo: 0,
        nearestRdps: {
            geoLocation: {
                type: "",
                coordinates: [0,0]
            },
            featureDetail: "",
            kilometer: 0,
            distance: 0,
            distanceDiff: 0
        },
        voltageLevel: 0,
        gsmSignalStrength: 0
    }
}



export const DeviceInfoDetailResponse: IDeviceInfoDetailResponseInterface={
    data: {
        result: DeviceInfoInitialState
    },
    errors: {
        message: ""
    },
    success: false
}