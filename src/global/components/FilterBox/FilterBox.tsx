import { IconComponents } from "../../Icons/IconsStore"


interface FilterProps{
    placeHolder:string;
}


const FilterBox: React.FC<FilterProps> = ({placeHolder}) => {
  return (
    <div className="relative">
        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
            {IconComponents.filterIcon}
        </div>
        <input 
        type="search" 
        id={`default-Search-${placeHolder}`} 
        placeholder={placeHolder}
        className="block w-full p-3 text-sm text-gray-900 transition-all duration-200 ease-out border-2 border-gray-800 rounded-3xl ps-10 bg-gray-50 focus:ring-gray-800 focus:border-gray-800" />
    </div>
  )
}

export default FilterBox
