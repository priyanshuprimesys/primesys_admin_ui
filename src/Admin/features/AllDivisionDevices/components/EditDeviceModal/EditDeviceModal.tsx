import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal"
import EditDeviceModalForm from "./EditDeviceModalForm";



interface EditModalProps{
    isOpen:boolean;
    onClose:()=>void;
    deviceId:string;
    data:any[];
}



const EditDeviceModal:React.FC<EditModalProps> = ({isOpen,onClose,data,deviceId}) => {
  return (
    <>
     <ChakraUiModal
     isOpen={isOpen}
     onClose={onClose}
     modalHeader="Edit Device"
     modalSize="lg"
     scroll={true}
     >
        <EditDeviceModalForm data={data} deviceId={deviceId} onHandleClose={onClose}/>
        </ChakraUiModal> 
    </>
  )
}

export default EditDeviceModal
