


export const getUserName = (name:string):string =>{
    let username = "";
    const nameArr = name.split(" ");
    if(nameArr.length > 1){
        const name1 = nameArr[0].charAt(0);
        const name2 = nameArr[1].charAt(0);
        username = username.concat(name1);
        username = username.concat(name2);
    }else{
        username = name.charAt(0);
    }
    
    return username;
}



function timeDurationUpto(filter:string){
    if(filter.includes("today")){
        return Math.floor(new Date().setHours(0,0,0,0) / 1000);
    }
    if(filter.includes("month")){
        const getStartOfMonth = (): number => {
            const now = new Date();
            return Math.floor(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).getTime() / 1000);
        };
        return getStartOfMonth();
    }

    if(filter.includes("week")){
        const getStartOfWeek = (): number => {
            const now = new Date();
            const day = now.getDay();
            const diff = (day === 0 ? -6 : 0) - day;
            const monday = new Date(now.setDate(now.getDate() + diff));
            monday.setHours(0, 0, 0, 0);
            return Math.floor(monday.getTime() / 1000);
        };
        return getStartOfWeek();
    }
}

export {timeDurationUpto};