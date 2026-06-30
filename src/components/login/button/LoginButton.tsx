import AuthCss from '../../../styles/modules/AuthStyles/AuthCss.module.css'


interface loginButtonProps{
    name:string;
    onSubmit:(e: React.MouseEvent<HTMLButtonElement>) => void;
}



const LoginButton: React.FC<loginButtonProps> = ({name,onSubmit}) =>{
    return(
        <button type="button" onClick={onSubmit} className={`${AuthCss.loginButton}`}>
            {name}
        </button>
    )
}



export default LoginButton;