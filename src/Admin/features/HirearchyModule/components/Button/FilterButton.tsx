import { IconComponents } from "../../../../../global/Icons/IconsStore";
import "../../../../../global/styles/GlobalCss.css"


interface FilterProps{
    onHandleClick:() => void;
}



const FilterButton: React.FC<FilterProps> = ({onHandleClick}) => {
  return (
    <button 
    onClick={onHandleClick} 
    className="flex items-center justify-center px-2 py-2 overflow-hidden transition-all duration-200 ease-in rounded outline-none hover:shadow-blackShadow bg-primary ripple w-14 h-9">
      {IconComponents.filterWhiteIcon}
    </button>
  )
}

export default FilterButton
