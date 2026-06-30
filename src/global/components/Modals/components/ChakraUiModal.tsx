import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface ChakraUiModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalHeader: string;
  children: JSX.Element;
  onHandleClick?: () => void;
  successButtonName?: string;
  errorButtonName?: string;
  modalSize?: string;
  scroll?: boolean;
  closeButton?:boolean;
}

const ChakraUiModal: React.FC<ChakraUiModalProps> = ({
  isOpen,
  onClose,
  modalHeader,
  children,
  onHandleClick,
  modalSize,
  successButtonName,
  errorButtonName,
  scroll,
}) => {
  return (
    <>
      <Modal
        scrollBehavior={scroll ? "inside" : "outside"}
        closeOnOverlayClick={false}
        size={modalSize}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
           <ModalCloseButton />
          <ModalBody>
              {children}
          </ModalBody>
          <ModalFooter className="gap-4">
            {successButtonName && (
              <Button onClick={onHandleClick} colorScheme="green">
                {successButtonName}
              </Button>
            )}
            {errorButtonName && (
              <Button onClick={onClose} colorScheme="red">
                {errorButtonName}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChakraUiModal;
