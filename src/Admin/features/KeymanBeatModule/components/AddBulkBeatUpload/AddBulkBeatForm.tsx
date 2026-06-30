import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { IKeyManFormikBulkRequestInterface, IKeymanSingleFileBeat } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import { useContext, useEffect, useState } from "react";
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { Button, useDisclosure } from "@chakra-ui/react";
import { BeatBulkUploadValidation } from "../../hooks/BeatBulkUploadValidation";
import CustomFormikFileUpload from "../../../../../global/components/input/CustomInputBox/CustomFormikFileUpload";
import { postKeyManFileUpload } from "../../../../../api/queries/app/hooks/keyman_multipleBeat_Upload";
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";

interface AddBulkFormProps {
  onCloseModal: () => void;
}

const AddBulkBeatForm: React.FC<AddBulkFormProps> = ({ onCloseModal }) => {
  const { parentDivisionId } = useContext(KeyManFileUploadContext);
  const { userDetail } = useContext(UserDetailContext);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [errorMsg,setErrorMessage] = useState<string>('');
  const {mutate,data} = postKeyManFileUpload();
  const [file,setFile] = useState<string>("");
  const [beatDevice,setBeatDevices] = useState<IKeymanSingleFileBeat>({
    divisionId: parentDivisionId,
    deviceImei:"",
    deviceName:"",
    deviceNo:"",
    updatedBy:userDetail.data.result.divisionId,
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


  //confirm modal
  const {isOpen,onClose,onOpen} = useDisclosure();
  const {isOpen:OpenData,onClose:OnDataClose,onOpen:onDataOpen} = useDisclosure();




 useEffect(()=>{
  if(data)
  {
    if(data.data.success === true){
      setIsLoading(false);
      onDataOpen();
      return;
    }
    else if(data.data.success === false)
    {
      setIsLoading(false);
      setErrorMessage(data.data.error.message);
      useErrorNotification("Error uploading sheet");
      return;
    }
  }

 },[data])

  return (
    <>
        <Formik
      onSubmit={(values, action) => {
        setIsLoading(true);
     

          setFile(values.file);
          setBeatDevices(values.beat);
          onOpen(); 
        setTimeout(() => {
       
          action.setSubmitting(false);
        }, 700);
        
      }}
      initialValues={{
        file: "",
        beat:{
          divisionId: parentDivisionId,
          deviceImei:"",
          deviceName:"",
          deviceNo:"",
          updatedBy:userDetail.data.result.divisionId,
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
        },
        
      }}
      validationSchema={BeatBulkUploadValidation}
    >
      {({
        values,
        setFieldValue,
      }: FormikProps<IKeyManFormikBulkRequestInterface>) => (
        <Form className="overflow-hidden">
          <div className="flex justify-between gap-2">
            <div className="flex flex-col w-full">
              <Field
                id="divisionId"
                name="divisionId"
                value={values.beat.divisionId}
                className="border-2 sr-only text-sm border-gray-400 focus:border-black px-2 rounded py-1"
                readOnly
              />
            </div>

            <div className="flex flex-col w-full">
              <Field
                id="updatedBy"
                name="updatedBy"
                value={values.beat.updatedBy}
                className="border-2 text-sm sr-only border-gray-400 focus:border-black px-2 rounded py-1"
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-between gap-2 my-2">
            <div className="w-full">
              <label htmlFor="bstartTime" className="font-semibold">
                Break Start Time
              </label>
              <Field
                type="time"
                name="beat.bstartTime"
                id="bstartTime"
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="beat.bstartTime"
                component="div"
                className="text-red-500 text-xss"
              />
            </div>
            <div className="w-full">
              <label htmlFor="bendTime" className="font-semibold">
                Break End Time
              </label>
              <Field
                type="time"
                name="beat.bendTime"
                id="bendTime"
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="beat.bendTime"
                component="div"
                className="text-red-500 text-xss"
              />
            </div>
          </div>
          <div>
            <div>
              <CustomFormikFileUpload
                placeHolder="Upload file"
                name="file"
                label="File"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("file", event.currentTarget.files?.[0] || "");
                }}
              />
            </div>
          </div>
          <div>
          <label className="flex gap-2 cursor-pointer">
              <Field type="checkbox" name="beat.sendAutoPeriodCommand" />
              <span>Send Auto Period Command</span>
            </label>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button disabled={isLoading} colorScheme="green" type="submit">
             {isLoading ? "Submitting" : "Submit"}
            </Button>
            <Button type="button" colorScheme="red" onClick={onCloseModal}>
              Cancel
            </Button>
          </div>
          {
            errorMsg 
            &&
            <div className=" h-24 overflow-x-scroll mt-3"> 
            <h3 className="font-semibold text-red-600 text-sm">Error:</h3>
            <p className="break-words text-red-600">
            {errorMsg}
            </p>
            
          </div>
          }

        </Form>
      )}
    </Formik>

    {
      isOpen &&
      <ChakraUiModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Confirm"
      >
        <>
        <h1>
          Are you sure, Send Auto Period Command is <b className="text-xl font-semibold">{beatDevice.sendAutoPeriodCommand ? 'TRUE' : 'FALSE'}</b>
        </h1>

        <div className="flex justify-end gap-4 mt-4">
        <Button colorScheme="green" onClick={()=>{
          onClose()
          mutate({file:file,beat:beatDevice});
          }}>
          Confirm
        </Button>
        <Button colorScheme="red" onClick={()=>{
          setIsLoading(false);
          onClose()}}>
          Cancel
        </Button>
        </div>
        </>



      </ChakraUiModal>
    }
    {
      OpenData &&
      <ChakraUiModal
      isOpen={OpenData}
      onClose={OnDataClose}
      modalHeader="Status"
      >
        <>
        <div className="my-6">
          <h1 className="mb-8">
            Device Beat Status
          </h1>
            {
            data?.data.data.result.errorDescription && 
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold">Error Description:</h1>
              <p>{data.data.data.result.errorDescription}</p>
            </div>
            }
            {
            data?.data.data.result.validRecords && 
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold">Valid Records:</h1>
              <p>{data.data.data.result.validRecords}</p>
            </div>
            }
            {
            data?.data.data.result.invalidRecords && 
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold">Invalid Records:</h1>
              <p>{data.data.data.result.invalidRecords}</p>
            </div>
            }
        </div>

        <div className="flex justify-end gap-4 mt-4">
        
        <Button colorScheme="red" onClick={()=>{
          OnDataClose();
          onCloseModal();}}>
          Cancel
        </Button>
        </div>
        </>



      </ChakraUiModal>
    }
    </>

  );
};

export default AddBulkBeatForm;
