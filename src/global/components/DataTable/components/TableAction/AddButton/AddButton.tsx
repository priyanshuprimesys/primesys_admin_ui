import { IconComponents } from "../../../../../Icons/IconsStore";
import './RippleCss.css';


interface AddProps{
    onHandleClick:()=> void;
    name?:string;
}



const AddButton: React.FC<AddProps> = ({onHandleClick,name}) => {
  return (
    <div>
      <button 
      type="button"
      className="ripple text-white border-2  border-white bg-primary  gap-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2" 
      onClick={onHandleClick}>
            {IconComponents.addIcon}
            <span className="text-center text-white">
                {
                name ? 
                name
                :
                "Add"
                 }
            </span>
      </button>
    </div>
  )
}

export default AddButton
