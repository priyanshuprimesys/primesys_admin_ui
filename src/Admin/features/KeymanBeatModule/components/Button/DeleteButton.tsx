import { Button } from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";

import { AppColor } from "../../../../../constants/color/AppColor";

interface DeleteButtonProps{
    onHandleClick?:()=> void;
}




const DeleteButton: React.FC<DeleteButtonProps> = ({onHandleClick}) => {
  return (
    <Button className="!bg-white !border-2 !px-3 !border-red-500 !h-8" onClick={onHandleClick}>
      <MdDeleteOutline size={22} color={AppColor.error} />
    </Button>
  )
}

export default DeleteButton
