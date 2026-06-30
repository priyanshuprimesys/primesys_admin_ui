import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface AlertDialogChakraInterface {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  alertHeader: string;
}

const AlertDialogChakra: React.FC<AlertDialogChakraInterface> = ({
  isOpen,
  onClose,
  children,
  alertHeader,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {alertHeader}
          </AlertDialogHeader>
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3}>
              okay
            </Button>
          </AlertDialogFooter>
        </AlertDialogOverlay>
      </AlertDialog>{" "}
    </>
  );
};

export default AlertDialogChakra;
