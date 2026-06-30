import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal"
import AddSingleBeatForm from "./AddSingleBeatForm";


interface AddSingleBeatUploadProps{
    isOpen:boolean;
    onClose:()=> void;
}



const AddSingleBeatUploadModal: React.FC<AddSingleBeatUploadProps> = ({isOpen,onClose}) => {
  return (
    <ChakraUiModal
    isOpen={isOpen}
    onClose={onClose}
    modalHeader="Add Single Beat"
    modalSize="xl"
    scroll={true}
    >
      <>
      <AddSingleBeatForm onCloseModal={onClose} />
      </>
    </ChakraUiModal>
  )
}

export default AddSingleBeatUploadModal
