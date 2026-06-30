import ChakraUiModal from "../../../../../../../global/components/Modals/components/ChakraUiModal";
import { RdpsForm } from "./RdpsForm";


interface RdpsModalInterface{
    isOpen:boolean;
    onClose:()=> void;
    modalHeader:string;
    parentId:string;
}



const RdpsModal: React.FC<RdpsModalInterface> = ({
    isOpen,onClose,modalHeader,parentId
}) => {
  return (
    <ChakraUiModal
    isOpen={isOpen}
    onClose={onClose}
    modalHeader={modalHeader}
    scroll={true}
    >
        <RdpsForm onClose={onClose} parentId={parentId}/>
    </ChakraUiModal>
  )
}




export default RdpsModal;
