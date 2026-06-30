import { IconComponents } from "../../../../../global/Icons/IconsStore";
import "../../../../../global/styles/GlobalCss.css"

interface EditButtonProps{
    onClickButton:()=> void;
}


const EditButton: React.FC<EditButtonProps> = ({onClickButton}) => {
  return (
      <button onClick={onClickButton} className="px-4 py-2 rounded-lg ripple hover:bg-dark bg-[#192745]" role="button">
        {IconComponents.editIcon}
      </button>
  )
}

export default EditButton
