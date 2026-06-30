import { useContext, useEffect, useState } from "react";
import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";
import { BeatTimeConvert } from "../../../../../../utils/TimeConvert/BeatTimeConvert";
import { ApproveBeatHook } from "../hooks/ApproveBeatHook";
import {
  IApprovalBeatDevice,
  IApprovalBeatDivision,
  IApprovalBeats,
} from "../interfaces/ApprovalBeatResponse";
import { FaBan } from "react-icons/fa";
import { UserDetailContext } from "../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import "../styles/AprrovalCss.css";

interface BeatApproveInterface {
  onClose: () => void;
  isOpen: boolean;
  beatData: IApprovalBeatDivision;
}

export interface IApprovalBeatDivisionDevice {
  deviceImei: string;
  beats: IApprovalBeats[];
}

export interface IApprovalBeatDivisionStateInterface {
  refFileName: string;
  devices: IApprovalBeatDivisionDevice[];
  createdAt: number;
  approved: boolean;
}

export interface IApprovalBeatDeviceArray{
    deviceImei: string,
    beats: IApprovalBeats[]
    approved: boolean;
}

const BeatApproveDetail: React.FC<BeatApproveInterface> = ({
  isOpen,
  onClose,
  beatData,
}) => {
  const { userDetail } = useContext(UserDetailContext);
  const [devicesBeat,setDevicesBeat] = useState<IApprovalBeatDeviceArray[]>([]);
  const [deviceIMei,setDeviceIMei] = useState<string>("");
  const beatLength = beatData.devices
    .map((a) => a.beats.length)
    .sort((a, b) => b - a);
  const { mutate, isPending, data, isSuccess } = ApproveBeatHook();

  useEffect(()=>{
      if(beatData){
        const filteredData: IApprovalBeatDeviceArray[] = beatData.devices.map((item)=> ({...item,approved:false}));
        setDevicesBeat(filteredData);
      }
  },[beatData]);

  useEffect(()=>{
    if(data?.data.success && isSuccess){
        const filteredData = devicesBeat.filter((x) => Number(x.deviceImei) == Number(deviceIMei) ?  x.approved = true : {...x});
        setDevicesBeat(filteredData);
        if(devicesBeat.filter((x)=> x.approved == false).length == 0){
            onClose();
        }
    }
  },[data,isSuccess]);

    const handleApproval = (beat: IApprovalBeatDevice,deviceImei:string) => {
        setDeviceIMei(deviceImei);
        const beatIds = beat.beats.map((item) => item.id);
        mutate({
        beatId: beatIds.toString(),
        updatedBy: userDetail.data.result.divisionId,
        });
    };

  return (
    <div>
      <ChakraUiModal
        isOpen={isOpen}
        onClose={onClose}
        modalHeader="Beats"
        modalSize="full"
        scroll={true}
      >
        <div className="border-[1px] mb-4 border-black py-2 px-4 w-full h-full overflow-y-scroll">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-2 border-collapse border-black table-auto">
              <thead className="border-b-2 border-black">
                <tr>
                  <th className="px-4 py-2 font-medium bg-gray-100 border sticky-col-1 col-w-100">
                    Slno
                  </th>
                  <th className="px-4 py-2 font-medium bg-gray-100 border sticky-col-2 col-w-150">
                    Device Name
                  </th>
                  <th className="px-4 py-2 font-medium bg-gray-100 border sticky-col-3 col-w-200">
                    Start-End km
                  </th>
                  {Array.from({ length: beatLength[0] }, (_, index: number) => (
                    <th
                      key={index}
                      className="px-4 py-2 font-medium bg-gray-100 border"
                    >
                      Trip {++index}
                    </th>
                  ))}
                  <th className="sticky right-0 z-10 px-4 py-2 font-medium bg-gray-100 border col-w-150">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {devicesBeat.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center border-b-2 border-black"
                  >
                    <td className="px-4 py-2 border sticky-col-1 col-w-100">
                      {++index}
                    </td>
                    <td className="px-4 py-2 border sticky-col-2 col-w-150">
                      {item.beats[0].device_name}
                    </td>
                    <td className="px-4 py-2 border sticky-col-3 col-w-200">
                      <span className="m-0 text-xs">
                        {item.beats[0].tripStartKm}
                      </span>
                      <span>-</span>
                      <span className="m-0 text-xs">
                        {item.beats[0].tripEndKm}
                      </span>
                      <span className="text-xs">km</span>
                    </td>
                    {Array.from({ length: beatLength[0] }, (_, tripIndex) => (
                      <td key={tripIndex} className="px-4 py-2 border">
                        {`${
                          BeatTimeConvert(item.beats[tripIndex]?.startTime) ||
                          "--"
                        } - ${
                          BeatTimeConvert(item.beats[tripIndex]?.endTime) ||
                          "--"
                        }`}
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-white border col-w-150">
                      <button
                        onClick={() => handleApproval(item,item.deviceImei)}
                        title="Beat Approval"
                        className={`px-2 py-2 text-[11px] ${item.approved ? "bg-green-500" : "bg-red-500"} !text-white rounded-md shadow-md hover:shadow-xl border-2 border-gray-100 hover:border-gray-500`}
                      >
                        {isPending ? (
                          "Approving...."
                        ) : item.approved == true ? (
                          "Approved"
                        ) : (
                          <span className="flex items-center gap-2 text-white">
                            <FaBan color="white" size={14} /> Not Approve
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ChakraUiModal>
    </div>
  );
};

export default BeatApproveDetail;
