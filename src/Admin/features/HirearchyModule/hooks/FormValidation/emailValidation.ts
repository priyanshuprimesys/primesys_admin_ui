



function validateEmail(email:string | undefined){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email)
    {
        return emailRegex.test(email);
    }
    else return false
}



export {validateEmail};