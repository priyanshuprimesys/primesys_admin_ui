import { IconComponents } from "../../../../../../global/Icons/IconsStore";



interface FilterButtonProps{
    buttonActive:boolean;
    setButtonActive:(active:boolean) =>void;
}


const StudentActiveFilterButton: React.FC<FilterButtonProps> = ({buttonActive,setButtonActive}) => {


    return (
        <>
            <button 
            type="button" 
            onClick={()=>setButtonActive(!buttonActive)} 
            className={`text-white ${buttonActive ? "bg-green-700" :"bg-red-700"}   font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center me-2 `}>
                {
                    buttonActive ?
                    IconComponents.toggleOnButton
                    :
                    IconComponents.toggleOffButton
                }
            </button>
        </>
    )
}

export default StudentActiveFilterButton
