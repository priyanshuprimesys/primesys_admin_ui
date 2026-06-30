import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal"
import EditSingleBeatForm from "./EditSingleBeatForm";


interface EditSingleBeatProps{
    isOpen:boolean;
    onClose:()=> void;
    beatId:string;
}



const EditSingleBeatModal: React.FC<EditSingleBeatProps> = ({isOpen,onClose,beatId}) => {
  return (
    <>
     <ChakraUiModal
     isOpen={isOpen}
     onClose={onClose}
     modalHeader="Edit Single Beat"
     modalSize="xl"
     >
        <EditSingleBeatForm onCloseModal={onClose} beatId={beatId} />
    </ChakraUiModal> 
    </>
  )
}

export default EditSingleBeatModal
