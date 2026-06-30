import { LuSquarePlus } from "react-icons/lu";


interface CreateButtonInterface{
    onClick:()=> void;
}

export const CreateButton:React.FC<CreateButtonInterface> = ({onClick}) => {
    return(
        <button onClick={onClick} className="bg-primaryDark rounded-lg text-white px-2 py-2">
            <LuSquarePlus color="white" size={24} />
        </button>
    )
}