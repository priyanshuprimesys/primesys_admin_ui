import { useEffect, useState } from "react"
import InputWithSearch from "../../../../../../../../global/components/input/InputWithSearch/InputWithSearch"
import ChakraUiModal from "../../../../../../../../global/components/Modals/components/ChakraUiModal"
import ParentDataSearchSelect from "../../../../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { IssueCreateNewForm } from "./IssueCreateNewForm"
import { useGetStudentDeviceDetailQuery } from "../../../../../../../../api/queries/app/hooks/student-device-detail-api-hooks"
import { GetDeviceInfoByImei } from "../hooks/GetDeviceInfoByImei"
import { IssueDeviceInformation } from "./IssueDeviceInformation"
import { DeviceInfoDetailResponse } from "../Initialstate/DeviceInfoInitialstate"
import { IIssueInterface } from "../../../../../interfaces/DeviceIssueInterface"
import { IDeviceInfoDetailResponseInterface } from "../Interface/DeviceInfoDetailResponse"
import { useQueryClient } from "@tanstack/react-query"


interface IssueCreateInterface {
    onClose: () => void,
    isOpen: boolean,
    item?: IIssueInterface
}



export const IssueCreateNewModel: React.FC<IssueCreateInterface> = ({ isOpen, onClose, item }) => {

    const queryClient = useQueryClient();
    const [parentId, setParentId] = useState<string>("");
    const [deviceImei, setDeviceImei] = useState<string>("");
    const { data } = useGetStudentDeviceDetailQuery(parentId);
    const { data: deviceInfoData } = GetDeviceInfoByImei(deviceImei);
    const [deviceInfo, setDeviceInfo] = useState<IDeviceInfoDetailResponseInterface>(DeviceInfoDetailResponse);

    useEffect(() => {
        if (isOpen) {
            setDeviceInfo(DeviceInfoDetailResponse);
            setDeviceImei("");
        }
        queryClient.removeQueries({
            queryKey: ["get-device-info-by-info"],
            exact: false
        });
    }, []);


    useEffect(() => {
        if (deviceInfoData?.data.success) {
            setDeviceInfo(deviceInfoData.data);
        } else {
            setDeviceInfo(DeviceInfoDetailResponse);
        }
    }, [deviceInfoData]);


    return (
        <ChakraUiModal
            isOpen={isOpen}
            onClose={onClose}
            modalHeader="Create Issue"
            modalSize="8xl"
        >
            <div className="w-full px-2 h-[90vh] overflow-scroll sm:px-4 md:px-6">
                <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
                    <div className="py-2">
                        <div className=" z-50 flex flex-col gap-3 px-2 sm:px-3 md:flex-row md:items-center lg:border-r-2 lg:border-gray-700 lg:pr-6 ">
                            {/* Division Search */}
                            <div className="w-full md:w-1/2">
                                <ParentDataSearchSelect
                                    setInputData={setParentId}
                                    placeHolder="Search Division....."
                                    divisionId={item?.divisionId}
                                />
                            </div>

                            {/* Student Search */}
                            <div className="w-full md:w-1/2">
                                <InputWithSearch
                                    dataClear={parentId === "" ? true : false}
                                    disabled={parentId === "" ? true : false}
                                    setSelectedValue={setDeviceImei}
                                    selectedVal="imeiNo"
                                    data={data ? data.data.data?.result : []}
                                    name="name"
                                    placeHolder="Enter Student Name"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <IssueDeviceInformation deviceInfo={deviceInfo} />
                        </div>
                    </div>

                    <div className="py-2">
                        <IssueCreateNewForm
                            deviceImei={Number(deviceImei)}
                            divisionId={parentId}
                            onClose={onClose}
                            data={item}
                        />
                    </div>
                </div>
            </div>
        </ChakraUiModal>
    )
}