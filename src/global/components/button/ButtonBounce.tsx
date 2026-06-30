import BounceCss from "../../styles/BounceCss.module.css";


interface BounceProps {
    name?: string;
    onHandleButtonClick: () => void;
    icon?:[JSX.Element,JSX.Element];
    selectedState?:boolean;
    disabled?:boolean;
}






const ButtonBounce: React.FC<BounceProps> = ({ name, onHandleButtonClick,icon,selectedState,disabled }) => {

    const backGroundCss = `bg-white border-2 border-[#222222] rounded m-0`;
    const textCss = `#222222 font-medium text-base`;


    return (
        <button
        disabled={disabled}
        onClick={onHandleButtonClick} 
        className={`${BounceCss.defaultCss} ${backGroundCss} ${textCss} text-center outline-none box-border inline-block cursor-pointer py-1.5 px-1.5`} role="button">
           <p className="m-0"> {icon ? 
           selectedState ? icon[0] : icon[1]
         : name }
         </p>
        </button>
    )
}

export default ButtonBounce
