export const isDeviceActive = (time: number, threshold = 300) => {
    if (time >= Math.floor(Date.now() / 1000) - threshold) {
        return true;
    }
    else{
        return false;
    }
}


export const isDeviceActiveToday = (time: number) => {
    if (time >= Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)) {
        return true;
    }
    else{
        return false;
    }
}


export const isDeviceOffToday = (time: number, threshold = 86400) => {
    if (time < Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) && time > Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) - threshold) {
        return true;
    }
    else{
        return false;
    }
}


export const isDeviceOffSince48hrs = (time: number) => {
    if (time <= Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) - 86400) {
        return true;
    }
    else{
        return false;
    }
}