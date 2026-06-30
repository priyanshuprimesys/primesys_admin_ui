import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";

interface DivisonLoginInterface {
  setParentId: (parent: string) => void;
}

const DivisionLogin: React.FC<DivisonLoginInterface> = ({ setParentId }) => {
  return (
    <>
      <ParentDataSearchSelect
        placeHolder="Enter Division Name"
        setInputData={setParentId}
      />
    </>
  );
};

export default DivisionLogin;
