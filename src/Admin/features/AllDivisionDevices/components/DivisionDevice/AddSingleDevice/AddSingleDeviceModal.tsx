import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";
import AddSingleDeviceForm from "./AddSingleDeviceForm";

interface AddSingleDeviceModalInterface {
  isOpen: boolean;
  onClose: () => void;
  parentID: string;
}

const AddSingleDeviceModal: React.FC<AddSingleDeviceModalInterface> = ({
  isOpen,
  onClose,
  parentID,
}) => {
  return (
    <ChakraUiModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Add Single Device"
      modalSize="xl"
      scroll={true}
    >
      <AddSingleDeviceForm onClose={onClose} parentID={parentID} />
    </ChakraUiModal>
  );
};

export default AddSingleDeviceModal;
