import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal"


interface IRdpsEditModal{
    isOpen:boolean,
    onClose:()=> void
}


export const RdpsEditModal: React.FC<IRdpsEditModal> = ({isOpen,onClose}) =>{
    return(
        <ChakraUiModal modalHeader="Edit Rdps" isOpen={isOpen} onClose={onClose} >
            <div>
            </div>
        </ChakraUiModal>
    )
}