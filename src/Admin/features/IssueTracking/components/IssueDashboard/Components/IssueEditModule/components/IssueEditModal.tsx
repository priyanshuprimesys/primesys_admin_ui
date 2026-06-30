import React, { useEffect, useState } from "react";
import ChakraUiModal from "../../../../../../../../global/components/Modals/components/ChakraUiModal";
import IssueForm from "./IssueForm";
import ParentDataSearchSelect from "../../../../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../../../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { DeviceInfoDetailResponse } from "../Initialstate/DeviceInfoInitialstate";
import { GetDeviceInfoByImei } from "../hooks/GetDeviceInfoByImei";
import { IssueDeviceInformation } from "./IssueDeviceInformation";
import { IDeviceInfoDetailResponseInterface } from "../Interface/DeviceInfoDetailResponse";
import { IIssueEditResponse } from "../Interface/IssueCommentInterface";


interface IssueEditInterface{
    isOpen:boolean;
    onClose:()=> void;
    issueEditData: IIssueEditResponse;
}


const IssueEditModal: React.FC<IssueEditInterface> = ({
    isOpen,onClose,issueEditData
}) => {

    const [parentId,setParentId] = useState<string>("");
    const [deviceImei,setDeviceImei] = useState<string>("");
    const {data,isSuccess} = useGetStudentDeviceDetailQuery(parentId);
    const {data:deviceInfoData} = GetDeviceInfoByImei(deviceImei);
    const [deviceInfo,setDeviceInfo] = useState<IDeviceInfoDetailResponseInterface>(DeviceInfoDetailResponse);
    
        useEffect(()=>{
            setDeviceInfo(DeviceInfoDetailResponse);
        },[]);
    
        
    
        useEffect(()=>{
            if(deviceInfoData?.data.success){
                setDeviceInfo(deviceInfoData.data);
            }else{
                setDeviceInfo(DeviceInfoDetailResponse);
            }
        },[deviceInfoData]);


    return(
        <ChakraUiModal isOpen={isOpen} modalSize="full" onClose={onClose}
            modalHeader="Issue Edit">
                <div className="overflow-y-scroll h-[84vh]">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="py-2 ">
                            <div className="z-50 flex gap-3 px-3 border-r-2 border-gray-700">
                                <ParentDataSearchSelect divisionId={issueEditData.divisionId} setInputData={setParentId} placeHolder="Search Division....." />
                                {
                                    isSuccess && data.data.success &&
                                            <InputWithSearch
                                    dataClear={parentId === "" ? true : false}
                                    disabled={parentId=== "" ? true : false} 
                                    setSelectedValue={setDeviceImei} 
                                    selectedVal="imeiNo" 
                                    data={data ? data.data.data?.result : []} 
                                    name="name" 
                                    placeHolder="Enter Student Name"
                                    deviceImei={issueEditData.deviceImei}
                                />
                                }
                        
                            </div>
                            <IssueDeviceInformation deviceInfo={deviceInfo} />
                        </div>
                        <div>
                            <IssueForm onClose={onClose} issueEditData={issueEditData} />
                        </div>
                    </div>
                </div>
          
        </ChakraUiModal>
    )
}


export default IssueEditModal;