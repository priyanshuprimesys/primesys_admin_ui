







function getTimeStampToDate(date: number) {
    const todayDate = new Date(date * 1000);
    const dateConvert = todayDate.toLocaleDateString([], { day: "2-digit", month: "short", year: "2-digit", hour12: false, hour: "2-digit", minute: '2-digit', second: '2-digit' });
    return dateConvert;
}


function getCutomTimeStampTODate(date: number) {
    const todayDate = String(date).length > 10 ? new Date(date) : new Date(date * 1000);
    const dateConvert = todayDate.toLocaleDateString([], { day: "2-digit", month: "short", year: "2-digit", hour12: false, hour: "2-digit", minute: '2-digit' });
    return dateConvert;
}


function getCutomTimeStampToTime(date: number) {
    const todayDate = String(date).length > 10 ? new Date(date) : new Date(date * 1000);
    const yesterDayTimeStamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const dateConvert = Math.floor(new Date(todayDate).getTime() / 1000) < yesterDayTimeStamp ? todayDate.toLocaleDateString([], { day: "2-digit", month: '2-digit', year: '2-digit' }) : todayDate.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    return dateConvert;
}
function getCutomTimeStampToHourMin(date: number) {
    const todayDate = String(date).length > 10 ? new Date(date) : new Date(date * 1000);
    const yesterDayTimeStamp = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const dateConvert = Math.floor(new Date(todayDate).getTime() / 1000) < yesterDayTimeStamp ? todayDate.toLocaleDateString([], { hour: "2-digit", minute: '2-digit', hour12: false }) : todayDate.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    return dateConvert;
}


function splitPostTime(date: number): number {
    let timeNum = "";
    const dateTIme = String(date);
    for (let i = 0; i < 10; i++) {
        timeNum = timeNum + dateTIme[i]
    }
    return Number(timeNum);
}



export { getTimeStampToDate, getCutomTimeStampTODate, getCutomTimeStampToTime, splitPostTime, getCutomTimeStampToHourMin };