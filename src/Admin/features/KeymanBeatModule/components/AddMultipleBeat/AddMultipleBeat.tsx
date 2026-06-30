import Modal from "../../../../../global/components/Modals/components/Modal"
import AddMultipleBeatForm from "./AddMultipleBeatForm";


interface AddMultipleProps{
  showModal:boolean;
  setShowModal:(show:boolean)=> void;
}



const AddMultipleBeat: React.FC<AddMultipleProps> = ({setShowModal,showModal}) => {
  return (
    <>
     <Modal modalHeader="Add Multiple Beat" setShowModal={setShowModal} showModal={showModal} >
      <>
      <AddMultipleBeatForm  setShowModal={setShowModal} />
      </>
      </Modal> 
    </>
  )
}

export default AddMultipleBeat
