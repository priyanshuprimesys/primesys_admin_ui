import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal"
import AddBulkBeatForm from "./AddBulkBeatForm";


interface AddBulkInterfaceProps{
    isOpen:boolean;
    onClose:()=> void;   
}






const AddBulkBeatUpload:React.FC<AddBulkInterfaceProps> = ({isOpen,onClose}) => {

  

  return (
    <>
      <ChakraUiModal
      modalSize="xl"
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Add Bulk Beat"
      >
        <>
        <AddBulkBeatForm onCloseModal={onClose}/>
        </>
      </ChakraUiModal>
    </>
  )
}

export default AddBulkBeatUpload
