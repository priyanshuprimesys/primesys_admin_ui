export const authToken = "auth_id"; 



class AuthService{

    saveLocalLoginInfo(accessToken:string){
        // Guard against persisting a bad token — JSON.stringify(undefined) becomes
        // the literal string "undefined", which then crashes every JSON.parse.
        if(!accessToken || accessToken === "undefined"){
            return;
        }
        localStorage.setItem(authToken,JSON.stringify(accessToken));
    }

    clearLoginToken(){
        localStorage.clear();
    }




    async checkAuthUser():Promise<boolean>{

        return new Promise((resolve)=>{
            let authCheck:boolean = false;
            const authenticationToken = localStorage.getItem(authToken);
            if(authenticationToken === null){
                authCheck = false;
            }else if(authenticationToken != null){
                authCheck = true;
            }
            return resolve(authCheck);
        })


 
    }

    // checkAuthentication():boolean{
    //     let auth:boolean = false;
    //     const authenticationToken = localStorage.getItem(authToken);
    //     if(authenticationToken === null){

    //     }
    // }
}




export default new AuthService();