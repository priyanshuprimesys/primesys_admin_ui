






export const BeatTimeConvert = (time: number) => {

    let hour = 0;
    let minute = 0;

    if (time < 0) {
        const totalSecond = 86400 + time;
        const totalMinutes = Math.floor(totalSecond / 60);

        hour = Math.floor(totalMinutes / 60);
        minute = totalMinutes % 60;
    }
    else if (time > 0) {
        const totalMinutes = Math.floor(time / 60);
        hour = Math.floor(totalMinutes / 60);
        minute = totalMinutes % 60;
    }
    else if (time == 0) {
        hour = 0;
        minute = 0;
    }

    const formattedTime = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;

    return formattedTime;

}