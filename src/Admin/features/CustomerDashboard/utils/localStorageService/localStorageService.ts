const locationApiCallTime = 'location-api-call-time';



export async function setApiCallTime(time: number) {
    localStorage.setItem(locationApiCallTime, JSON.stringify(time));
}



export function currentTimeStamp(): number {
    return Math.floor(new Date().getTime() / 1000);
}





export function timeAgo(): string {
    const localTime = localStorage.getItem(locationApiCallTime);
    const time = localTime ? JSON.parse(localTime) : 0;
    const currentTime = Math.floor(new Date().getTime() / 1000);

    const diff = currentTime - time;

    if (diff < 60) {
        return `${diff} seconds ago`;
    }
    else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} `;
    } else {
        const days = Math.floor(diff / 86400);
        return `${days} day${days > 1 ? 's' : ''}`;
    }
}

