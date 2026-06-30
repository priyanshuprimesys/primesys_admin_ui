import { Button } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { AppColor } from "../../../../../constants/color/AppColor";

interface EditButtonProps{
    onHandleClick?:()=> void;
}




const EditButton: React.FC<EditButtonProps> = ({onHandleClick}) => {
  return (
    <Button className="!bg-white !border-2 !px-3 !border-blue-500 !h-8" onClick={onHandleClick}>
      <FaEdit size={14} color={AppColor.blueColor500} />
    </Button>
  )
}

export default EditButton
