import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";



interface DeviceTableInterface{
    isOpen:boolean;
    onClose:() => void;

}



const DeviceTableModal: React.FC<DeviceTableInterface> = ({isOpen,onClose}) =>{
    return (
        <>
            <ChakraUiModal
            isOpen={isOpen}
            onClose={onClose}
            modalHeader="Devices"
            >
                <></>
            </ChakraUiModal>
        </>
    )
}


export default DeviceTableModal;