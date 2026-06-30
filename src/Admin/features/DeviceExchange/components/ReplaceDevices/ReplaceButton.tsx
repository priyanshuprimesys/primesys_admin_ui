import { IconComponents } from "../../../../../global/Icons/IconsStore"



interface ReplaceProps{
    onHandleClick:()=> void;
}



const ReplaceButton: React.FC<ReplaceProps> = ({onHandleClick}) => {
    return (
        <button onClick={onHandleClick} className="flex items-center px-2 py-2 font-semibold text-gray-100 border-2 border-gray-300 rounded ripple bg-primary text-xss">
            {IconComponents.addIcon} Replace New Device
        </button>
    )
}

export default ReplaceButton
