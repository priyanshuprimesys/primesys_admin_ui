

export const getMilliToDateTIme = (time:number) =>{
    const dateTime = new Date(time);
    return dateTime.toLocaleDateString([],{day:"2-digit",month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'});
}