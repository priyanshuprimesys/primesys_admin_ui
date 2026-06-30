import { AuthForm } from "../../../../Admin/pages/AdminAuth/AdminAuth";
// import LoginForm from "../../../../components/login/form/LoginForm";
import AuthCss from '../../../../styles/modules/AuthStyles/AuthCss.module.css';




const AuthLayout = ()  =>{


    return(
        <div className={`h-[100vh] flex items-center justify-center ${AuthCss.loginAuthContainer}`}>
            <AuthForm/>
        </div>
    )
}



export default AuthLayout;