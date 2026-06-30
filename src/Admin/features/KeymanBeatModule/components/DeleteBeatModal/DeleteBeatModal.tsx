import { useContext, useEffect } from "react";
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import { useKeymanSingleBeatDeleteQuery } from "../../../../../api/queries/app/hooks/keyman-single-beat-delete-api-hooks";
import { convertSecondsToTime } from "../../services/convertSecondsToTime";
import { Button } from "@chakra-ui/react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useQueryClient } from "@tanstack/react-query";
import { device_keyman_imei_beat_query } from "../../../../../api/queries/app/queryKeys/queryKeys";

interface DeleteModalprops {
  beatId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteBeatModal: React.FC<DeleteModalprops> = ({
  beatId,
  isOpen,
  onClose,
}) => {
  const { userDetail } = useContext(UserDetailContext);
  const { beatModuleDetailData, keymanBeatDetailRequest } = useContext(
    KeyManFileUploadContext
  );
  const { mutate, isSuccess } = useKeymanSingleBeatDeleteQuery();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      useSuccessNotification("Beat deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [device_keyman_imei_beat_query, keymanBeatDetailRequest],
      });
      onClose();
    }
  }, [isSuccess]);

  const deleteData = beatModuleDetailData.filter((x) => x.beatId === beatId);

  const handleDeleteID = () => {
    mutate({ beatId: beatId, updatedBy: userDetail.data.result.divisionId });
  };

  return (
    <>
      <ChakraUiModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader="Delete Beat"
      >
        <>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Device No:</span>
              <span>{deleteData[0].deviceNo}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="font-semibold">Start Time:</span>
                <span>{convertSecondsToTime(deleteData[0].startTime)}</span>
              </div>
              <div>
                <span className="font-semibold">End Time:</span>
                <span>{convertSecondsToTime(deleteData[0].endTime)}</span>
              </div>
            </div>
            <div className="mt-2">
              <h1 className="font-semibold mb-2">
                Are you sure you want to delete this Beat?
              </h1>
              <div className="flex justify-end gap-4">
                <Button colorScheme="red" onClick={handleDeleteID}>
                  Delete
                </Button>
                <Button colorScheme="gray" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      </ChakraUiModal>
    </>
  );
};

export default DeleteBeatModal;
