import ReactDOM from "react-dom";
import CustomModalCss from "./styles/CustomModalCss.module.css";
import { IconComponents } from "../../Icons/IconsStore";

interface CustomProps {
  children: any;
  setModalActive: (active: boolean) => void;
  modalHeader: string;
}

const CustomModal: React.FC<CustomProps> = ({
  children,
  setModalActive,
  modalHeader,
}) => {
  const overlayRoot = document.getElementById("modal_portal");

  return overlayRoot
    ? ReactDOM.createPortal(
        <>
          <div className={CustomModalCss.modalContainer}>
            <div
              className={`${CustomModalCss.customModal} px-4 py-2 overflow-hidden`}
            >
              <div
                className={`flex justify-between pt-2 pb-1 border-b-2 border-gray-600 items-center`}
              >
                <div>
                  <p className="m-0 text-base font-semibold underline">
                    {modalHeader ? modalHeader : "Modal Header"}
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setModalActive(false)}
                >
                  {IconComponents.closeIcon}
                </div>
              </div>
              <div className={`${CustomModalCss.customModalContent} py-3`}>
                {children}
              </div>
            </div>
          </div>
        </>,
        overlayRoot
      )
    : null;
};

export default CustomModal;
