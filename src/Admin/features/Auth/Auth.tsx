import AuthCss from "../../../styles/modules/AuthStyles/AuthCss.module.css";
import Logo from '../../../assets/images/Logo.jpeg';
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";




const Auth = () =>{
    return(
        <>
         <div className={`${AuthCss.loginFormContainer}`}>
            <div className="flex flex-row items-center justify-center gap-2 mb-5">
                <img src={Logo} alt="Company Logo" className="w-10 rounded-full" />
                <div className="flex-col">
                <p className="m-0 text-lg font-medium text-gray-100">Primesys</p>
                {/* <p className="m-0 text-[12px] text-gray-300">ISO 9001:2015 Certified</p> */}
                </div>
 
            </div>
            <div className="mb-5">
                <h1 className="text-base text-center text-gray-200">Admin Login</h1>
            </div>
            <div>
                <LoginForm/>
            </div>
            <div className="flex justify-center py-2">
                <p className="m-0 text-center text-white text-xss">
                    By signing up , you agree to our Terms.
                    <Link to={'/privacy'} className="text-xs font-semibold text-white underline underline-offset-2">Privacy Policy</Link>
                </p>
                
            </div>
        </div>
        </>
    )
}


export default Auth;