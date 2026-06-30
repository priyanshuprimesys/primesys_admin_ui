import { useContext, useEffect, useState } from "react"
import ParentDataSearchSelect from "../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import { Button } from "@chakra-ui/react";
import RdpsTab from "./modules/rdps-tab";
import { useGetDivisionRdpsQuery } from "../../../api/queries/app/hooks/division_rdps_get_api_hooks";
import { RdpsContext } from "./contexts/RdpsContext";





export const RDPSUtility = () =>{

    const [parentId,setParentId] = useState<string>('');
    const {setRdpsData,setRdpsApiLoading} = useContext(RdpsContext);
    const {data,isSuccess,isFetching}  = useGetDivisionRdpsQuery(parentId);

    useEffect(()=>{
        if(isSuccess && data.data){
            setRdpsData(data.data);
        }
        if(isFetching || !isFetching){
            setRdpsApiLoading(isFetching)
        }
    },[isSuccess,isFetching]);

    return(
        <div>
            <div className="flex items-center gap-4">
                {/* Parent component to select division id */}
                <ParentDataSearchSelect setInputData={setParentId} placeHolder="Select division...." />
                <Button className="!bg-primaryDark !text-white">
                    Upload Rdps
                </Button>
            </div>
            <RdpsTab/>
        </div>
    )
}