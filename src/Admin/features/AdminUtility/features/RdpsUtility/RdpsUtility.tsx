import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import RdpsDataTable from "./components/RdpsDataTable/RdpsDataTable";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import RdpsModal from "./components/RdpsModule/RdpsModal";

const RdpsUtility = () => {
  const [parentId, setParentId] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const handleClick = () => {
    if (parentId === "") {
      toast({
        title: "Division Id null",
        status: "error",
        duration: 1200,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    onOpen();
  };

  return (
    <>
      <div className="flex justify-between gap-2 ">
        <div className="w-full">
          <ParentDataSearchSelect
            setInputData={setParentId}
            placeHolder="Select division name"
          />
            <Link className="flex justify-end text-blue-700 underline underline-offset-1" to={"http://primesystrack.co.in/templates/rdps_upload_template.csv"}>Download Rdps Template</Link>
        </div>

        <Button className="!bg-primaryDark !text-white" onClick={handleClick}>
          Upload Rdps
        </Button>
      </div>

      {isOpen && (
        <RdpsModal
          parentId={parentId}
          isOpen={isOpen}
          onClose={onClose}
          modalHeader="Rdps Data Upload"
        />
      )}

      <div className="my-4">
        <RdpsDataTable divisionId={parentId}/>
      </div>
    </>
  );
};

export default RdpsUtility;
