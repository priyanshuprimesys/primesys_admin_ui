import { useEffect, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { useGetStudentDeviceDetailQuery } from "../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { GetDeviceInfoByImei } from "../IssueDashboard/Components/IssueEditModule/hooks/GetDeviceInfoByImei";
import { IDeviceInfoDetailResponseInterface } from "../IssueDashboard/Components/IssueEditModule/Interface/DeviceInfoDetailResponse";
import { DeviceInfoDetailResponse } from "../IssueDashboard/Components/IssueEditModule/Initialstate/DeviceInfoInitialstate";
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../../global/components/input/InputWithSearch/InputWithSearch";
import { IssueDeviceInformation } from "../IssueDashboard/Components/IssueEditModule/components/IssueDeviceInformation";
import { AllIssueForm } from "./AllIssueForm";
import { IIssueEditResponse } from "../IssueDashboard/Components/IssueEditModule/Interface/IssueCommentInterface";


interface IssueCreateInterface{
    onClose:()=> void,
    isOpen: boolean,
    item?: IIssueEditResponse
}



export const IssueInformation: React.FC<IssueCreateInterface> = ({isOpen,onClose,item}) =>{

    const queryClient = useQueryClient();
    const [parentId,setParentId] = useState<string>("");
    const [deviceImei,setDeviceImei] = useState<string>("");
    const {data} = useGetStudentDeviceDetailQuery(parentId);
    const {data:deviceInfoData} = GetDeviceInfoByImei(deviceImei);
    const [deviceInfo,setDeviceInfo] = useState<IDeviceInfoDetailResponseInterface>(DeviceInfoDetailResponse);

    useEffect(()=>{
        if(isOpen){
            setDeviceInfo(DeviceInfoDetailResponse);
            setDeviceImei("");
        }
        queryClient.removeQueries({
            queryKey: ["get-device-info-by-info"],
            exact: false
        });
    },[]);


    useEffect(()=>{
        if(deviceInfoData?.data.success){
            setDeviceInfo(deviceInfoData.data);
        }else{
            setDeviceInfo(DeviceInfoDetailResponse);
        }
    },[deviceInfoData]);


    return(
        <ChakraUiModal
            isOpen={isOpen}
            onClose={onClose}
            modalHeader="Create Issue"
            modalSize="full"
        >
            <div className="grid grid-cols-2 gap-6">
                <div className="py-2 ">
                    <div className="z-50 flex gap-3 px-3 border-r-2 border-gray-700">
                        <ParentDataSearchSelect setInputData={setParentId} placeHolder="Search Division....." divisionId={item?.divisionId} />
                        <InputWithSearch
                            dataClear={parentId === "" ? true : false}
                            disabled={parentId=== "" ? true : false} 
                            setSelectedValue={setDeviceImei} 
                            selectedVal="imeiNo" 
                            data={data ? data.data.data?.result : []} 
                            name="name" 
                            placeHolder="Enter Student Name"
                        />
                    </div>
                    <IssueDeviceInformation deviceInfo={deviceInfo} />
                </div>
                <div>
                    <AllIssueForm onClose={onClose}  data={item}  />
                </div>
            </div>
        </ChakraUiModal>
    )
}