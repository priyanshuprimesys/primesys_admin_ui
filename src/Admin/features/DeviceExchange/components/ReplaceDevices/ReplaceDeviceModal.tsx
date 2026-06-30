import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import ReplaceDeviceForm from "./ReplaceDeviceForm";


interface ReplaceModalProps{
    isOpen:boolean;
    onClose:()=>void
}




const ReplaceDeviceModal: React.FC<ReplaceModalProps> = ({isOpen,onClose}) => {





    return (
        <>

            <ChakraUiModal 
            isOpen={isOpen}
            onClose={onClose}
            modalHeader="Replace Device"
            >
                <ReplaceDeviceForm onClose={onClose} />
            </ChakraUiModal>
        </>
    )
}

export default ReplaceDeviceModal
