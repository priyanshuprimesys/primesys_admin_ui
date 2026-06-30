import React from "react";
import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";



interface RdpsCalculateInterface{
    isOpen:boolean;
    onClose:()=> void;
    data:string;
    success:boolean;
}

type RdpsResult = {
  Message: string;
};


const RdpsCalculateSuccessModal: React.FC<RdpsCalculateInterface> = ({isOpen,onClose,data,success}) =>{
    

    const parsedData: RdpsResult = JSON.parse(data);
    return(
        <ChakraUiModal
            isOpen={isOpen}
            onClose={onClose}
            modalHeader={`RDPS Recalculate`}
            scroll={false}
            >
                <div>
                    <div className="flex gap-2 items-center mb-4">
                        <h1 className="font-bold text-sm">Rdps Recalculation: </h1>
                        {success ? <p className="text-green-500">Success</p> : <p className="text-red-500">Error</p>}
                    </div>
                    {parsedData.Message}
                </div>
        </ChakraUiModal>
        
    )
}


export default RdpsCalculateSuccessModal;