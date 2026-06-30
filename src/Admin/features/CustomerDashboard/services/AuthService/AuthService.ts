export const customerAuthToken = 'customer_auth_Token';







function setCustomerAuthToken(token:string){
    localStorage.setItem(customerAuthToken,JSON.stringify(token));
}



async function getCustomerAuthToken():Promise<string| boolean>{
    let token = localStorage.getItem(customerAuthToken);
    return token ?? false;
}



export {
    setCustomerAuthToken,
    getCustomerAuthToken
}