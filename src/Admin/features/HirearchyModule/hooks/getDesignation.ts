




function getDesignation(dept:number){

    let name:string = ''

    if(dept == 1)
    {
        name = "Control";
    }
    else if(dept == 2){
        name = "DEN";
    }
    else if(dept == 3)
    {
        name = "ADEN";
    }
    else if(dept == 4)
    {
        name= "PWAY";
    }
    else if(dept == 5)
    {
        name  = "Jr PWAY";
    }
    return name;
}




export {getDesignation};