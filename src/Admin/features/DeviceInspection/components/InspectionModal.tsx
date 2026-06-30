import { useState } from "react";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal"
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";









interface IInspectionInterface{
    isOpen:boolean;
    onClose:()=> void
}



export const InspectionModal: React.FC<IInspectionInterface> = ({isOpen,onClose}) =>{
    
    const [_parentId,setParentId] = useState<string>("");
    return(
        <ChakraUiModal isOpen={isOpen} onClose={onClose} modalHeader="Division Selection">
            <div>
                <ParentDataSearchSelect placeHolder="Select Division" setInputData={setParentId} />
            </div>
        </ChakraUiModal>
    )
}