import { Button } from "@chakra-ui/react";
import ChakraUiModal from "../../../../../../../global/components/Modals/components/ChakraUiModal";
import { DestroyBeatHook } from "../../hooks/DestoryBeatHook";
import { useContext } from "react";
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { useQueryClient } from "@tanstack/react-query";
import { BeatApprovalQueryKey } from "../../service/queryKey";
import { toast } from "react-toastify";


interface IBeatFileDestroyModel {
    isOpen: boolean,
    onClose: () => void,
    refFileName: string
}



const BeatFileDestroyModel: React.FC<IBeatFileDestroyModel> = ({ onClose, isOpen, refFileName }) => {

    const queryClient = useQueryClient();
    const { mutate, isPending } = DestroyBeatHook();
    const { userDetail } = useContext(UserDetailContext);

    const onHandleDestroy = () => {
        if (!refFileName) {
            toast.error("No File Exists");
            return;
        }
        mutate({ refFileName: refFileName, updatedBy: userDetail.data.result.userName },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [BeatApprovalQueryKey] });
                    toast.success("Beat has been removed successfully", {
                        delay: 500,

                    });
                    setTimeout(() => {
                        onClose();
                    }, 900);
                }
            }
        );
    }


    return (
        <>
            <ChakraUiModal isOpen={isOpen} onClose={onClose} modalHeader="Beat Destroy Model">
                <>
                    <h1 className="text-red-500 font-semibold text-lg">Delete Beat File</h1>
                    <p>
                        Are you sure you want to delete this file once deleted , file cannot be recovered.
                    </p>

                    <div className="flex justify-end gap-4">
                        <Button onClick={onClose} className="!bg-white">
                            Cancel
                        </Button>
                        <Button onClick={onHandleDestroy} className="!bg-red-500 !text-white">
                            {isPending ? "Deleting..." : "Confirm"}
                        </Button>
                    </div>
                </>
            </ChakraUiModal>
        </>
    )
}


export default BeatFileDestroyModel;