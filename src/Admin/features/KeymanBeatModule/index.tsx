import { useContext,  useEffect, } from "react";
import { KeyManFileUploadContext } from "../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import KeymanBeatSearch from "./components/KeymanBeatSearch/KeymanBeatSearch";
import KeymanBeatDataTable from "./components/KeymanBeatDataTable/KeymanBeatDataTable";
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from "@chakra-ui/react";
import AddBulkBeatUpload from "./components/AddBulkBeatUpload/AddBulkBeatUpload";
import { useErrorNotification } from "../../../utils/hooks/notification/useErrorNotification";
import AddSingleBeatUploadModal from "./components/AddSingleBeatUpload/AddSingleBeatUploadModal";
import { useGetKeymanBeatImeiDivisionQuery } from "../../../api/queries/app/hooks/keyman-beat-imei-api-hooks";
import { toast } from "react-toastify";
import ApprovalBeatModule from "./components/ApprovalBeatModule/ApprovalBeatModule";
import { BeatUploadModule } from "./modules/BeatUploadModule/BeatUploadModule";




const KeymanBeatModule = () => {

    const {parentDivisionId,studentDeviceImei,studentDeviceType,setBeatModuleDetailData,keymanBeatDetailRequest,setKeymanBeatDetailRequest} = useContext(KeyManFileUploadContext);
    const{isOpen,onClose,onOpen} = useDisclosure();
    const{isOpen:singleOpen,onClose:singleOnClose,onOpen:singleOnOpen} = useDisclosure();
    

    
    const { data,isSuccess,isFetching } = useGetKeymanBeatImeiDivisionQuery(keymanBeatDetailRequest);


    useEffect(()=>{
        if(data?.data.success == true)
        {
            setBeatModuleDetailData(data?.data.data.result);
        }
        else if(data?.data.success == false){
            toast.error(`${data.data.error.message}`,{
                position:"top-right"
            })
        }
    },[isSuccess,data]);

    const onHandleBeatUpload = () =>{
        setKeymanBeatDetailRequest((prev)=>({
            ...prev,
            deviceImei:studentDeviceImei,
            deviceType:studentDeviceType,
            divisionId:parentDivisionId
        }))
    }

    const handleBulkModal = () =>{
        if(parentDivisionId === "")
        {
            useErrorNotification("Please select parent Id");
            return;
        }
        else{
            onOpen();
        }
    }

    const handleSingleBeat =() =>{
        if(parentDivisionId === "")
        {
            useErrorNotification("Please select parent id");
            return;
        }
        else if(studentDeviceImei === "")
        {
            useErrorNotification("Please select device name");
            return;
        }
        else{
            singleOnOpen();
        }
    }








    return (
        <>
            <Tabs border={2} borderColor={'black'} backgroundColor={"white"}>
                <TabList>
                    <Tab>Beat Module</Tab>
                    <Tab>Beat Uploads</Tab>
                    <Tab>Approval Beats</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <div>
                            <KeymanBeatSearch onHandleClick={onHandleBeatUpload}/>
                            <div className="flex gap-8 px-4 py-2 bg-gray-100 rounded">
                                <Button  onClick={handleBulkModal} className="!bg-dark !text-white !font-normal !text-xs">
                                    Add Bulk Beat
                                </Button>
                                <Button  onClick={handleSingleBeat} className="!bg-dark !text-white !font-normal !text-xs">
                                    Add Single Beat
                                </Button>
                            </div>
                            <KeymanBeatDataTable isLoading={isFetching} data={data?.data ? data?.data.data.result : []} />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <BeatUploadModule/>
                    </TabPanel>
                    <TabPanel>
                        <ApprovalBeatModule />
                    </TabPanel>
                </TabPanels>
            </Tabs>
          
            {isOpen && <AddBulkBeatUpload isOpen={isOpen} onClose={onClose} />}
            {singleOpen && <AddSingleBeatUploadModal isOpen={singleOpen} onClose={singleOnClose} />}
        </>

    )
}




export default KeymanBeatModule;