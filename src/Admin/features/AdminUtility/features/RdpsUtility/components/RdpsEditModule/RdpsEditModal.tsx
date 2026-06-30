import ChakraUiModal from "../../../../../../../global/components/Modals/components/ChakraUiModal";
import { RdpsEditForm } from "./RdpsEditForm";




interface RdpsEditInterface{
    isOpen:boolean;
    onClose:() => void;
    editId:string;
    // parentId:string;
}



export const RdpsEditModal: React.FC<RdpsEditInterface> = ({isOpen,onClose,editId}) => {
  return (
    <ChakraUiModal
    isOpen={isOpen}
    onClose={onClose}
    modalHeader="Rdps Edit"
    scroll={true}
    modalSize="lg"
    >
        <RdpsEditForm editId={editId} onClose={onClose} />
    </ChakraUiModal>
  )
}
