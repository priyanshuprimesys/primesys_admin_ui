import { Button, useDisclosure } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { InspectionModal } from "./InspectionModal";
import { PiPlusBold } from "react-icons/pi";




export const DeviceInspectionHeader = () =>{

    const {isOpen,onOpen,onClose} = useDisclosure();

    return(
        <>
            <div className="grid w-full grid-cols-[1fr_170px] items-center justify-center px-2 py-4 mt-5 bg-white border-gray-600 rounded hover:shadow-lg hover:shadow-gray-600">
                <div className="flex items-center pl-2 bg-white border-2 border-black rounded">
                    <FiSearch size={18} color="black" />
                    <input type="search" name="" id="" placeholder="Search......" 
                    className="w-full px-3 ml-2 text-base placeholder:text-sm bg-white border-0 border-l-2 outline-none border-l-gray-500" />
                </div>
                <div className="flex justify-end">
                    <Button onClick={()=> onOpen()}  className="!bg-primaryDark gap-2 !py-1 !px-2 !text-white">
                        Create Report <PiPlusBold/>
                    </Button>
                </div>
            </div>

            {
                isOpen && 
                <InspectionModal isOpen={isOpen} onClose={onClose} />
            }
        </>

    )
}