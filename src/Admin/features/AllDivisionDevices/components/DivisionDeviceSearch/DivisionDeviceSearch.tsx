import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"



interface DivisionDeviceProps{
    onClickParentSearch:(id:string)=> void;
}


const DivisionDeviceSearch: React.FC<DivisionDeviceProps> = ({onClickParentSearch}) => {




  return (
    <div className="flex gap-4 items-center">
      <ParentDataSearchSelect placeHolder="Enter parent name" setInputData={onClickParentSearch} />
    </div>
  )
}

export default DivisionDeviceSearch
