import { useEffect } from "react";


const LogoutService = () => {

    useEffect(()=>{
        const logout = () =>{
            localStorage.clear();
            window.location.href = '/';
        }
        logout();
    },[]);

    return null;
}



export default LogoutService;