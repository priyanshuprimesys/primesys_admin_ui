import "../../../../../../global/styles/GlobalCss.css";

interface AddUserProps{
    onHandleClick:()=>void;
}



const AddTrackUserButton: React.FC<AddUserProps> = ({onHandleClick}) =>{
    return(
        <button onClick={onHandleClick} className="px-4 py-3 mb-1 text-xs text-white rounded ripple bg-theme-cardLinkColor">
        Add Track User
        </button>
    )
}



export default AddTrackUserButton;