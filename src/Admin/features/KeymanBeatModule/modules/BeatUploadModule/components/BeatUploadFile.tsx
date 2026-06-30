import { ChangeEvent, useEffect, useRef, useState } from "react";
// import { ImageConfig } from "../config/IconsConfig";
import { RiUploadCloudLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useDisclosure } from "@chakra-ui/react";
import { IBeatUploadJSON } from "../interfaces/IBeatUploadInterface";
import { PostBeatModuleHook } from "../hooks/PostBeatModuleHook";
import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";


interface BeatUploadFileInterface{
    divisionId:string;
}


const BeatUploadFile: React.FC<BeatUploadFileInterface> = ({divisionId}) =>{  
    
    const {isOpen,onOpen,onClose} = useDisclosure();
    const {mutate,isPending, data, isSuccess} = PostBeatModuleHook();
    const wrapperRef = useRef<HTMLInputElement | null>(null);
    const [beatDevice,setBeatDevices] = useState<IBeatUploadJSON>({
        divisionId: `${divisionId}`,
        deviceImei:"",
        deviceName:"",
        deviceNo:"",
        updatedBy:`${divisionId}`,
        updatedAt:`${Math.floor(new Date().getTime() / 1000)}`,
        sectionName:"",
        beatId:"",
        activeStatus:true,
        startTime:"",
        endTime:"",
        bstartTime:"00:00",
        bendTime:"00:00",
        tstartKm:"",
        tendKm:"",
        deviceTypeId:"",
        sendAutoPeriodCommand:false
    });
    const [excelFile,setExcelFile] = useState<any>();

    useEffect(()=>{
        if(divisionId){
            setBeatDevices({
                divisionId: `${divisionId}`,
                deviceImei:"",
                deviceName:"",
                deviceNo:"",
                updatedBy:`${divisionId}`,
                updatedAt:`${Math.floor(new Date().getTime() / 1000)}`,
                sectionName:"",
                beatId:"",
                activeStatus:true,
                startTime:"",
                endTime:"",
                bstartTime:"00:00",
                bendTime:"00:00",
                tstartKm:"",
                tendKm:"",
                deviceTypeId:"",
                sendAutoPeriodCommand:false
            })
        }
    },[divisionId])

    useEffect(()=>{
        if(isSuccess){
            onOpen();
        }
    },[isSuccess, data, onOpen]);

    const onDragEnter = () => wrapperRef.current?.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');

    const onDrop = () => wrapperRef.current?.classList.remove('dragover');

    const onFileDrop = (e:ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files){
            const newFile = e.target.files[0];
            setExcelFile(newFile);
        }
    }

    const onClearFile = () =>{
        if(wrapperRef.current){
            wrapperRef.current.value = "";
            setExcelFile("");
        }
    }

    const onFileUpload = () =>{
        if(excelFile.name !== undefined && wrapperRef.current){
            mutate({
                file:excelFile,
                beat:beatDevice
            });
            setExcelFile("");
            wrapperRef.current.value = ''
        }
    }


    return(
        <>
            <div className="h-full px-8 py-8 bg-white border-2 border-gray-300 rounded-md hover:border-gray-700">
                <h1 className="mb-8 text-xl font-semibold text-center">Upload Beat Module Excel File</h1>
                <div ref={wrapperRef} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} className="relative bg-[#E5F3FD] flex items-center justify-center min-w-[400px] min-h-[200px] border-2 rounded-xl border-dashed border-[#0096C7]">
                    <div className="flex flex-col items-center justify-center w-full">
                        <RiUploadCloudLine size={68} color="#CCDBEE" className="cursor-pointer"/>
                        <p className="p-3 text-xs font-semibold text-center text-gray-500">Drag and Drop your files here or Choose file</p>
                    </div>
                    <input 
                        type="file"
                        onChange={onFileDrop}
                        accept=".xls,.xlsx" 
                        value={""} 
                        disabled={divisionId == "" ? true : false}
                        className="absolute top-0 left-0 w-[100%] h-[100%] cursor-pointer opacity-0" 
                    />
                </div>
                <div>
                    <h2 className="mt-4 font-medium">Uploaded File:</h2>
                    {excelFile ? (
                        <div className="flex justify-between px-1 py-3 border-b-2 border-gray-500 ">
                            <p className="font-medium">{excelFile.name}</p>
                            <button onClick={()=> onClearFile()} ><IoClose color="black" /></button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No file selected</p>
                    )}
                </div>
                <div className="w-full mt-8">
                    <button type="submit" onClick={()=> onFileUpload()} className="bg-[#24A0ED] w-full text-white text-sm font-semibold py-3 rounded">
                        {isPending ? 'Uploading....' : 'Upload'}
                    </button>
                </div>
            </div>

            {
                isOpen && 
                        <ChakraUiModal
                            isOpen={isOpen}
                            onClose={onClose}
                            modalHeader={`Beat Module Upload`}
                        >
                            <div>
                                {
                                    isSuccess ?
                                    data?.data.success  ?
                                        <div>
                                            <h1 className="text-base font-semibold text-green-600">Success</h1>
                                            <p className="text-xs font-semibold text-green-500">Your file have been uploaded successfully</p>
                                            <div className="flex items-center gap-2">
                                                <h1 className="font-semibold">Valid Records:</h1>
                                                <p>{data.data.data.result.validRecords}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h1 className="font-semibold">InValid Records</h1>
                                                <p>{data.data.data.result.invalidRecords}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h1 className="font-semibold">Error Description</h1>
                                                <p>{data.data.data.result.errorDescription}</p>
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h1 className="font-semibold text-red-600">Error:</h1>
                                                <p>{data?.data?.error?.message}</p>
                                            </div>
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                        </ChakraUiModal>
            }


        </>
 
    )
}

export default BeatUploadFile;