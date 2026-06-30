import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import RenewDeviceForm from "./RenewDivisionForm";

interface RenewDeviceModalInterface {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
}

const RenewDivisionModal: React.FC<RenewDeviceModalInterface> = ({
  isOpen,
  onClose,
  parentId,
}) => {
  return (
    <>
      <ChakraUiModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader="Renew Single Device"
      >
        <RenewDeviceForm parentId={parentId} onClose={onClose} />
      </ChakraUiModal>
    </>
  );
};

export default RenewDivisionModal;
