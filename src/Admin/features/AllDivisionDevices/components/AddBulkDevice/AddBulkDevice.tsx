import { Button } from "@chakra-ui/react";

interface AddBulkInterface {
  onBulkAdd: () => void;
  parentId: string;
}

const AddBulkDevice: React.FC<AddBulkInterface> = ({ onBulkAdd, parentId }) => {
  return (
    <Button
      disabled={parentId !== "" ? false : true}
      onClick={onBulkAdd}
      className="!bg-primaryDark !text-white"
    >
      Add Bulk Device
    </Button>
  );
};

export default AddBulkDevice;
