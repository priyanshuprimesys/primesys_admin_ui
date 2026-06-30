





export const convertSecondsToTime = (secondNumber:number) =>{
    let hour = 0;

    let minute = 0;

    if(secondNumber < 0)
    {
        const totalSecond = 86400 + secondNumber;
        const totalMinutes = Math.floor(totalSecond / 60);

        hour = Math.floor(totalMinutes / 60);
        minute = totalMinutes % 60;
    }
    else if(secondNumber > 0)
    {
        const totalMinutes  = Math.floor(secondNumber / 60);
        hour = Math.floor(totalMinutes / 60);
        minute = totalMinutes % 60;
    }
    else if(secondNumber == 0)
    {
        hour = 0;
        minute=0
    }



   

    const formattedTime = `${hour< 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}`: minute}`;


    return formattedTime;
}