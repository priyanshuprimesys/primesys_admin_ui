import { useState } from "react";
import { useGetIOTDataPacket } from "./hooks/useGetIotDataPacket";
import { IOTDataRequest } from "./interface/IOTDataRequest";
import ParentDataSearchSelect from "../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import InputWithSearch from "../../../global/components/input/InputWithSearch/InputWithSearch";
import { useGetStudentDeviceDetailQuery } from "../../../api/queries/app/hooks/student-device-detail-api-hooks";
import DatePicker from "react-datepicker";
import "./styles/datePickerCss.css"
import IOTDataTable from "./components/iot-data-table";

const IotData = () => {
    const [parentDivisionId, setParentDivisionId] = useState<string>('');
    const [deviceImei, setDeviceImei] = useState<string>('');
    const [dataPageSize, setDataPageSize] = useState<number>(100);
    const [startTimeStamp, setStartTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [endTimeStamp, setEndTimeStamp] = useState<number>(Math.floor(new Date().getTime() / 1000));
    const [packetRequest, setPacketRequest] = useState<IOTDataRequest>({ imei: 0, startTime: 0, endTime: 0, page: 0, size: dataPageSize });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const onStartTime = (date: Date | null) => {
        if (!date) { setStartDate(new Date()); }
        else { setStartDate(date); setStartTimeStamp(Math.floor(date.getTime() / 1000)); }
    };

    const onEndTime = (date: Date | null) => {
        if (!date) { setEndDate(new Date()); }
        else { setEndDate(date); setEndTimeStamp(Math.floor(date.getTime() / 1000)); }
    };

    const handlePacket = () => {
        setPacketRequest(prev => ({ ...prev, imei: Number(deviceImei), startTime: startTimeStamp, endTime: endTimeStamp }));
    };

    const handleNewPageCall = () => {
        const newSize = dataPageSize + 100;
        setDataPageSize(newSize);
        setPacketRequest(prev => ({ ...prev, size: newSize, imei: Number(deviceImei), startTime: startTimeStamp, endTime: endTimeStamp }));
    };

    const { data: studentData } = useGetStudentDeviceDetailQuery(parentDivisionId);
    const { data, isFetching, isSuccess } = useGetIOTDataPacket(packetRequest);
    const pageSize = data?.data ? data.data.data.result.size : 0;

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

            {/* ── Filter bar ── */}
            <div className="flex-shrink-0 px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 flex-wrap">

                    {/* Division */}
                    <div className="flex-1 min-w-[200px]">
                        <ParentDataSearchSelect placeHolder="Search Division…" setInputData={setParentDivisionId} />
                    </div>

                    {/* Device */}
                    <div className="flex-1 min-w-[200px]">
                        <InputWithSearch
                            dataClear={parentDivisionId === ""}
                            setSelectedValue={setDeviceImei}
                            selectedVal="imeiNo"
                            data={studentData?.data?.data?.result ?? []}
                            name="name"
                            additionalInfo="imeiNo"
                            placeHolder="Select Device…"
                        />
                    </div>

                    {/* Start datetime */}
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 hover:border-emerald-400 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <DatePicker
                            selected={startDate}
                            showTimeSelect
                            timeFormat="HH:mm"
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="bg-transparent outline-none text-sm w-36 cursor-pointer"
                            onChange={onStartTime}
                        />
                    </div>

                    <span className="text-gray-400 text-sm font-medium flex-shrink-0">to</span>

                    {/* End datetime */}
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 hover:border-emerald-400 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <DatePicker
                            selected={endDate}
                            showTimeSelect
                            minDate={startDate}
                            maxDate={new Date()}
                            timeFormat="HH:mm"
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="bg-transparent outline-none text-sm w-36 cursor-pointer"
                            onChange={onEndTime}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        disabled={!deviceImei}
                        onClick={handlePacket}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#075E54] hover:bg-emerald-800 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        Submit
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="flex-1 min-h-0 overflow-hidden px-5 py-4">
                <IOTDataTable
                    data={data?.data ? data.data.data.result.content : []}
                    isFetching={isFetching}
                    pageSize={pageSize}
                    handleNextPageData={handleNewPageCall}
                    dataPageSize={dataPageSize}
                    isSuccess={isSuccess}
                />
            </div>
        </div>
    );
};

export default IotData;
