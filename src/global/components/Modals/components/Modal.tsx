import { IconComponents } from "../../../Icons/IconsStore";
import InfoStyle from "../styles/modal.module.css";
import ReactDOM from "react-dom";


interface InfoModalProps {
    children: any;
    modalHeader: string;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}



const Modal: React.FC<InfoModalProps> = ({ children, modalHeader, setShowModal, showModal }) => {

    const overlayRoot = document.getElementById("modal_portal");

    return overlayRoot ?

        ReactDOM.createPortal(
            <>
                {
                    showModal ?
                        <div className={InfoStyle.modalContainer}>
                            <div className={`${InfoStyle.customModal} px-4 py-2 overflow-hidden`}>
                                <div className={`flex justify-between pt-2 pb-1 border-b-2 border-gray-600 items-center`}>
                                    <div>
                                        <p className="m-0 text-base font-semibold underline">
                                            {
                                                modalHeader ?
                                                    modalHeader
                                                    :
                                                    'Modal Header'
                                            }
                                        </p>
                                    </div>
                                    <div className="cursor-pointer" onClick={() => setShowModal(false)}>
                                        {IconComponents.closeIcon}
                                    </div>
                                </div>
                                <div className={`${InfoStyle.customModalContent} py-3`}>
                                    {children}
                                </div>
                            </div>
                        </div>
                        :
                        ''
                }

            </>,
            overlayRoot
        )
        :
        null

}

export default Modal;
