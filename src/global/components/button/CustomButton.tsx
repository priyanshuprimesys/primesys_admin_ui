
interface CustomButtonProps {
    onHandleSubmit?: () => void;
    isLoading?: boolean | null;
    name?: string;
    type?: "button" | "submit" | "reset";
    bgColor?: string;
    className?: string;
    icon?: JSX.Element;
    disabled?:boolean
}




const CustomButton: React.FC<CustomButtonProps> = ({
    name,
    onHandleSubmit,
    isLoading,
    type,
    bgColor,
    className,
    icon,
    disabled
}) => {
    return (
        <div>
            <button
            disabled={disabled}
                onClick={onHandleSubmit}
                type={type ? type : "button"}
                className={`outline-none 
        ripple
                overflow-hidden
                ${bgColor}
                ${className}
                font-medium 
                rounded-lg 
                py-2.5 
                me-2 
                tracking-wider
                transition-all
                duration-300
                ease-in
                hover:shadow-hoverBlackShadow`}>
                {
                    icon
                    &&
                    <p className="m-0 mr-2">
                        {icon}
                    </p>
                }

                <p className="m-0">
                    {isLoading ? 'Loading....' : name}
                </p>



            </button>
        </div>
    )
}

export default CustomButton
