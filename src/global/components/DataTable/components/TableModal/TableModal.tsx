import ReactDOM from "react-dom";
import ModalCss from "./ModalCss.module.css";
import { IconComponents } from "../../../../Icons/IconsStore";

interface TableModalProps {
  headerName?: string;
  setModalActive: (modal: boolean) => void;
  children?: any;
}

const TableModal: React.FC<TableModalProps> = ({
  headerName,
  setModalActive,
  children,
}) => {
  const overlayRoot = document.getElementById("modal_portal");

  return overlayRoot
    ? ReactDOM.createPortal(
        <>
          <div className={`${ModalCss.modalContainer}`}>
            <div className={`${ModalCss.customModal}`}>
              <div className={ModalCss.modalHeader}>
                <p className="px-4 py-1 m-0 font-mono text-xl font-semibold text-center">
                  {headerName}
                </p>
                <button
                  className="flex items-center w-8 h-8 px-2 py-2 overflow-hidden bg-gray-200 rounded-full cursor-pointer ripple"
                  onClick={() => setModalActive(false)}
                >
                  {IconComponents.closeIcon}
                </button>
              </div>
              <div className={`${ModalCss.modalContent}`}>{children}</div>
            </div>
          </div>
        </>,
        overlayRoot
      )
    : null;
};

export default TableModal;
