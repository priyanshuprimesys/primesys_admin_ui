import { Button } from "@chakra-ui/react";
import { MdEditSquare } from "react-icons/md";
import { AppColor } from "../../../../../constants/color/AppColor";


interface EditButtonProps{
    onHandleClick:()=>void;
}



const EditButton: React.FC<EditButtonProps> = ({onHandleClick}) => {
  return (
    <>
     <Button className="border-2 !px-2  border-blue-500 !bg-white" onClick={onHandleClick}>
     <MdEditSquare size={20} color={AppColor.warning} />
    </Button> 
    </>
  )
}

export default EditButton
