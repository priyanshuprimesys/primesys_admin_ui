import { Button } from "@chakra-ui/react";

interface AddSingleInterface {
  parentID: string;
  onHandleClick: () => void;
}

const AddSingleDevice: React.FC<AddSingleInterface> = ({
  parentID,
  onHandleClick,
}) => {
  return (
    <Button
      disabled={parentID !== "" ? false : true}
      onClick={onHandleClick}
      className="!bg-primaryDark !text-white"
    >
      Add Single Device
    </Button>
  );
};

export default AddSingleDevice;
