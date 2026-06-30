import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";


interface DeviceResponseProps{
    isOpen:boolean;
    onClose:()=> void;
    commandResponse:string;
}


const ExchangeResponse: React.FC<DeviceResponseProps> = ({commandResponse,isOpen,onClose}) => {

  return (
    <ChakraUiModal
    onClose={onClose}
    isOpen={isOpen}
    modalHeader="Device Response"
    errorButtonName="Close"
    >
        <>
        <p className="text-xs font-semibold text-black break-words">
            {commandResponse}
        </p>
        </>
    </ChakraUiModal>
  )
}

export default ExchangeResponse;

