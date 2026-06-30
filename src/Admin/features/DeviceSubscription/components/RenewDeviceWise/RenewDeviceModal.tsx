import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import RenewDeviceForm from "./RenewDeviceForm";

interface RenewDeviceModalInterface {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  data: any[];
}

const RenewDeviceModal: React.FC<RenewDeviceModalInterface> = ({
  isOpen,
  onClose,
  deviceId,
  data,
}) => {
  return (
    <>
      <ChakraUiModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader="Renew Single Device"
      >
        <RenewDeviceForm deviceId={deviceId} data={data} onClose={onClose} />
      </ChakraUiModal>
    </>
  );
};

export default RenewDeviceModal;
