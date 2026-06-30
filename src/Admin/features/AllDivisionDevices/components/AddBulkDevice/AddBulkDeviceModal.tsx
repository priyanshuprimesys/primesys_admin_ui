import React from "react";
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import AddBulkDeviceForm from "./AddBulkDeviceForm";

interface AddBulkDeviceInterface {
  isOpen: boolean;
  parentId: string;
  onClose: () => void;
}

const AddBulkDeviceModal: React.FC<AddBulkDeviceInterface> = ({
  isOpen,
  onClose,
  parentId,
}) => {
  return (
    <ChakraUiModal
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Add Bulk Device"
      modalSize="lg"
    >
      <div>
        <AddBulkDeviceForm onClose={onClose} parentId={parentId} />
      </div>
    </ChakraUiModal>
  );
};

export default AddBulkDeviceModal;
