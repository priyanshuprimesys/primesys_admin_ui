export const TimeStampToDateTime = (time:number | undefined | null)=>{
    if(time)
    {
        return new Date(time * 1000).toLocaleDateString([],{day:'2-digit',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'});

    }
    return null;
}