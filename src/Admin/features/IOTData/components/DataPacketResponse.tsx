import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";


interface DeviceResponseProps{
    isOpen:boolean;
    onClose:()=> void;
    onOpen?:boolean;
    dataPacket:string;
}


const DevicePacketResponse: React.FC<DeviceResponseProps> = ({dataPacket,isOpen,onClose}) => {

  return (
    <ChakraUiModal
    onClose={onClose}
    isOpen={isOpen}
    modalHeader="Device Response"
    errorButtonName="Close"
    >
        <>
        <p className="text-xs font-semibold text-black break-words">
            {dataPacket}
        </p>
        </>
    </ChakraUiModal>
  )
}

export default DevicePacketResponse;

