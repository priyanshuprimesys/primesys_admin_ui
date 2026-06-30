import { useEffect, useState } from "react";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import DatePicker from "react-datepicker";
import "./styles/datePickerCss.css"
import StudentDeviceSelect from "../ReportGeneration/components/StudentDeviceSelect/StudentDeviceSelect";
import { useRdpsRecalculateMutation } from "../../../../../api/queries/app/hooks/rdps-recalculate-api";
import { useDisclosure } from "@chakra-ui/react";
import RdpsCalculateSuccessModal from "./components/RdpsCalculateSuccessModal";



const RdpsCalculate = () => {

    const [parentId, setParentId] = useState<string>("");
    const [startTimeStamp, setStartTimeStamp] = useState<number>(0);
    const [endTimeStamp, setEndTimeStamp] = useState<number>(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [studentReportDevices, setStudentReportDevices] = useState<string>('');

    const { mutate, isPending, data, isSuccess } = useRdpsRecalculateMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (isSuccess) {
            onOpen();
        }
    }, [isSuccess]);

    const onStartTime = (date: Date | null) => {

        if (!date) {
            setStartDate(new Date());
        }
        else {
            setStartDate(date);
            const StartTime = Math.floor(new Date(date).getTime() / 1000);
            setStartTimeStamp(StartTime);
        }
    }

    const onEndTime = (date: Date | null) => {

        if (!date) {
            setEndDate(new Date());
        } else {
            setEndDate(date)
            const endTimeStamp = Math.floor(new Date(date).getTime() / 1000);
            setEndTimeStamp(endTimeStamp)
        }

    }

    const onHandleSubmit = () => {

        if (parentId.length === 0) {
            alert("Please select division");
            return;
        }

        if (studentReportDevices.length == 0) {
            alert("Please select devices");
            return;
        }

        mutate({ division_id: parentId, start_time: startTimeStamp, end_time: endTimeStamp, device_list: studentReportDevices });
    }


    return (
        <div className="w-full">
            <h3 className="font-semibold text-center">RDPS Recalculate</h3>
            <div className="flex items-center w-full gap-2">
                <div className="w-1/4">
                    <ParentDataSearchSelect placeHolder={"Search division"} setInputData={setParentId} />
                </div>

                <div className="flex w-2/3 gap-4">
                    <div className="w-1/2">
                        <DatePicker
                            selected={startDate}
                            showTimeSelect={true}
                            timeFormat="HH:mm"
                            dateFormat={"dd/MM/yyyy HH:mm"}
                            className="py-1.5 border-2 focus:border-2 rounded px-2 w-full text-center border-black"
                            onChange={(date) => onStartTime(date)}
                        />
                    </div>
                    <div className="w-1/2">
                        <DatePicker
                            selected={endDate}
                            showTimeSelect={true}
                            minDate={startDate}
                            maxDate={new Date()}
                            timeFormat="HH:mm"
                            dateFormat={"dd/MM/yyyy HH:mm"}
                            className="py-1.5 border-2 focus:border-2 rounded px-2 w-full text-center border-black"
                            onChange={(date) => onEndTime(date)}
                        />
                    </div>
                </div>
                <div className="flex justify-end w-1/4">
                    <button onClick={onHandleSubmit} className="w-full py-2 text-white rounded-md bg-primaryDark">
                        {isPending ? "Submitting...." : "Submit"}
                    </button>
                </div>
            </div>

            <div className="my-6">
                <StudentDeviceSelect deviceTypeID={""} studentDevices={studentReportDevices} divisionId={parentId} setStudentDevices={setStudentReportDevices} />
            </div>

            {
                isOpen &&
                <RdpsCalculateSuccessModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={data ? data.data.data.result : ""}
                    success={data ? data?.data.success : false}
                />
            }
        </div>
    )
}

export default RdpsCalculate;