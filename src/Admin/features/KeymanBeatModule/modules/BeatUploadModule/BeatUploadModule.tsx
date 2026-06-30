import { useState } from "react"
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import BeatUploadFile from "./components/BeatUploadFile"





export const BeatUploadModule = () =>{

    const [parentId,setParentId] = useState<string>("")

    return(
        <div className="py-4">
            <ParentDataSearchSelect setInputData={setParentId} placeHolder="Search Division..." />
            <div className="pl-5 my-3">
                <h1 className="text-xs text-red-500">Please select Division before uploading file</h1>
            </div>
            <BeatUploadFile divisionId={parentId}/>
        </div>
    )
}