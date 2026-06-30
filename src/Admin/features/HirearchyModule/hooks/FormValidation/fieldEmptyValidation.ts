




function isEmptyValidation(field:string | undefined){
    if(field?.length == 0)
    {
        return false;
    }
    else return true;
}



export {isEmptyValidation};