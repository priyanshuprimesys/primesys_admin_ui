


function check_autoresend(name:string):boolean{

    let check:boolean = false;

    while(name.includes('_autoresend'))
    {
        check = true;
    }
    return check;
}



export {check_autoresend};