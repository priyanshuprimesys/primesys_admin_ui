import { useContext, useEffect, useState } from "react";
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import DatePicker from "react-datepicker";
import "../styles/datePickerCss.css";
import { Badge, Button, useDisclosure } from "@chakra-ui/react";
import LeafletMap from "./maps/LeafLetmap";
import { useDeviceLocationsQuery, useMutateLocations } from "../data/queryOptions";
import { DeviceLocation, IDeviceLocationRequest } from "../data/schema";
import LocationModal from "./LocationModal";
import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const LocationTracker = () => {
    const [parentDivisionId, setParentDivisionId] = useState<string>("");
    const [studentDeviceImei, setStudentDeviceImei] = useState<string>("");
    const { onClose, onOpen, isOpen } = useDisclosure();
    const { data } = useGetStudentDeviceDetailQuery(parentDivisionId);
    const [deviceRequest, setDeviceRequest] = useState<IDeviceLocationRequest>({
        deviceImei: 0,
        startTime: 0,
        endTime: 0,
    });
    const [deleteOperationPerformed, setDeleteOperationPerformed] = useState<boolean>(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTimeStamp, setStartTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [endTimeStamp, setEndTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [markersToBeDeleted, setMarkersToBeDeleted] = useState<DeviceLocation[]>([]);
    const { mutate, isPending } = useMutateLocations();
    const { userDetail } = useContext(UserDetailContext);
    const { data: locations, isFetching, isSuccess } = useDeviceLocationsQuery(deviceRequest);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isSuccess) {
            if (locations.data.data.result.length == 0) {
                toast.error("No Locations available");
                return;
            }
            setMarkersToBeDeleted([]);
        }
    }, [locations, isSuccess]);

    const onStartTime = (date: Date | null) => {
        if (!date) {
            setStartDate(new Date());
        } else {
            setStartDate(date);
            setStartTimeStamp(Math.floor(new Date(date).getTime() / 1000));
        }
    };

    const onEndTime = (date: Date | null) => {
        if (!date) {
            setEndDate(new Date());
        } else {
            setEndDate(date);
            setEndTimeStamp(Math.floor(new Date(date).getTime() / 1000));
        }
    };

    const handleLocations = () => {
        setDeviceRequest((prev) => ({
            ...prev,
            deviceImei: Number(studentDeviceImei),
            startTime: startTimeStamp,
            endTime: endTimeStamp,
        }));
    };

    const handleDeleteLocations = () => {
        const timeStamps = markersToBeDeleted.map((loc) => loc.timestamp);
        const userId = userDetail.data.result.divisionId;
        if (!userId) {
            alert("No user id selected");
            return;
        }
        mutate(
            { imei: Number(studentDeviceImei), timestamp: timeStamps, divisionId: userId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["device-location-base-key"] });
                    setMarkersToBeDeleted([]);
                    setDeleteOperationPerformed(true);
                },
            }
        );
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 justify-between items-center">
                    <ParentDataSearchSelect placeHolder="Enter Parent Name" setInputData={setParentDivisionId} />
                    <InputWithSearch
                        dataClear={parentDivisionId === "" ? true : false}
                        setSelectedValue={setStudentDeviceImei}
                        selectedVal="imeiNo"
                        data={data ? data.data.data?.result : []}
                        name="name"
                        placeHolder="Enter Student Name"
                    />
                    <DatePicker
                        selected={startDate}
                        showTimeSelect={true}
                        timeFormat="HH:mm"
                        dateFormat={"dd/MM/yyyy HH:mm"}
                        className="py-1.5 border-2 focus:border-2 z-[50] rounded w-full px-2 text-center border-black"
                        onChange={(date) => onStartTime(date)}
                    />
                    <DatePicker
                        selected={endDate}
                        showTimeSelect={true}
                        timeFormat="HH:mm"
                        dateFormat={"dd/MM/yyyy HH:mm"}
                        className="py-1.5 border-2 focus:border-2 z-[1000] rounded px-2 w-full text-center border-black"
                        onChange={(date) => onEndTime(date)}
                    />
                    <Button
                        disabled={studentDeviceImei == "" || isFetching}
                        className="!bg-primaryDark w-[500px] !text-white !px-8 !py-4"
                        onClick={handleLocations}
                    >
                        {isFetching ? "Fetching..." : "Show Locations"}
                    </Button>
                </div>
                <div className="flex items-center gap-5">
                    <div className="text-xs flex items-end gap-2">
                        <div className="font-bold">Selected Locations:</div>
                        <div>{markersToBeDeleted.length}</div>
                    </div>
                    <Badge
                        onClick={onOpen}
                        variant={"solid"}
                        className="!bg-blue-600 !py-1 !px-1 cursor-pointer !text-white"
                    >
                        Show Locations
                    </Badge>
                    <Button onClick={handleDeleteLocations} className="!bg-red-600 !text-white">
                        {isPending ? "Locations Deleting..." : "Delete Locations"}
                    </Button>
                </div>
                <div>
                    <LeafletMap
                        deleteOperationPerformed={deleteOperationPerformed}
                        setDeleteOperationPerformed={setDeleteOperationPerformed}
                        locations={locations?.data.data.result ?? []}
                        SetMarkersToBeDeleted={setMarkersToBeDeleted}
                    />
                </div>
            </div>

            {isOpen && (
                <LocationModal locations={markersToBeDeleted} isOpen={isOpen} onClose={onClose} />
            )}
        </>
    );
};

export default LocationTracker;
