import { nameShortner } from "./nameshortner";


interface loginProps{
    props: string;
    resend?: boolean;
}


const LoginName: React.FC<loginProps> = ({ props, resend }) => {

    const name = nameShortner(props);
    const isResend = resend === true || (props && props.includes("_autoresend"));

  return (
    <div className="flex flex-col items-center gap-0.5">
        <p className={isResend ? "font-mono text-xs font-semibold text-orange-500" : "font-mono text-xs font-semibold"}>{name}</p>
        {isResend && (
          <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full leading-none">
            Resend
          </span>
        )}
    </div>
  )
}

export default LoginName
