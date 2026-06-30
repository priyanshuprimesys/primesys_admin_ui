import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Button } from "@chakra-ui/react";
import ParentDataSearchSelect from "../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { useDeviceLocationsQuery } from "../data/queryOptions";
import { IDeviceLocationRequest } from "../data/schema";
import SimpleLeafletMap from "./maps/SimpleLeafletMap";
import { toast } from "react-toastify";
import "../styles/datePickerCss.css";

type Props = {
    label: string;
};

const DeviceMapPanel = ({ label }: Props) => {
    const [parentDivisionId, setParentDivisionId] = useState<string>("");
    const [studentDeviceImei, setStudentDeviceImei] = useState<string>("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTimeStamp, setStartTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [endTimeStamp, setEndTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [deviceRequest, setDeviceRequest] = useState<IDeviceLocationRequest>({
        deviceImei: 0,
        startTime: 0,
        endTime: 0,
    });

    const { data } = useGetStudentDeviceDetailQuery(parentDivisionId);
    const { data: locations, isFetching, isSuccess } = useDeviceLocationsQuery(deviceRequest);

    useEffect(() => {
        if (isSuccess && locations.data.data.result.length === 0) {
            toast.error(`${label}: No locations available`);
        }
    }, [locations, isSuccess, label]);

    const onStartTime = (date: Date | null) => {
        const d = date ?? new Date();
        setStartDate(d);
        setStartTimeStamp(Math.floor(d.getTime() / 1000));
    };

    const onEndTime = (date: Date | null) => {
        const d = date ?? new Date();
        setEndDate(d);
        setEndTimeStamp(Math.floor(d.getTime() / 1000));
    };

    const handleLocations = () => {
        setDeviceRequest({
            deviceImei: Number(studentDeviceImei),
            startTime: startTimeStamp,
            endTime: endTimeStamp,
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold text-gray-700 border-b pb-1">{label}</div>
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex-1 min-w-[160px]">
                    <ParentDataSearchSelect placeHolder="Enter Parent Name" setInputData={setParentDivisionId} />
                </div>
                <div className="flex-1 min-w-[160px]">
                    <InputWithSearch
                        dataClear={parentDivisionId === ""}
                        setSelectedValue={setStudentDeviceImei}
                        selectedVal="imeiNo"
                        data={data ? data.data.data?.result : []}
                        name="name"
                        placeHolder="Enter Student Name"
                    />
                </div>
                <DatePicker
                    selected={startDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="py-1.5 border-2 rounded px-2 text-center border-black text-xs w-[150px]"
                    onChange={onStartTime}
                />
                <DatePicker
                    selected={endDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="py-1.5 border-2 rounded px-2 text-center border-black text-xs w-[150px]"
                    onChange={onEndTime}
                />
                <Button
                    disabled={studentDeviceImei === "" || isFetching}
                    size="sm"
                    className="!bg-primaryDark !text-white"
                    onClick={handleLocations}
                >
                    {isFetching ? "Fetching..." : "Show"}
                </Button>
            </div>
            <div>
                <SimpleLeafletMap locations={locations?.data.data.result ?? []} />
            </div>
        </div>
    );
};

export default DeviceMapPanel;
