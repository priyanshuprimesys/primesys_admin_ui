import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { Button } from "@chakra-ui/react";
import "../../styles/datePickerCss.css";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import MultiStudentSelect from "./components/MultiStudentSelect";
import { useDestroyLocationMutation, useLocationTransferMutation, useRevertLocationMutation } from "./data/queryOptions";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

const toEpoch = (date: Date): number => {
    const d = new Date(date);
    return Math.floor(d.getTime() / 1000);
};

const BulkLocationChange = () => {
    const [fromStartDate, setFromStartDate] = useState<Date>(new Date());
    const [fromEndDate, setFromEndDate] = useState<Date>(new Date());
    const [toStartDate, setToStartDate] = useState<Date>(new Date());
    const [toEndDate, setToEndDate] = useState<Date>(new Date());
    const [parentId, setParentId] = useState<string>("");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    const { userDetail } = useContext(UserDetailContext);
    const { mutate: transfer, isPending: transferPending, isSuccess: transferSuccess, isError: transferError, data: transferData, error: transferErr } = useLocationTransferMutation();
    const { mutate: revert, isPending: revertPending, isSuccess: revertSuccess, isError: revertError, data: revertData, error: revertErr } = useRevertLocationMutation();
    const { mutate: destroy, isPending: destroyPending, isSuccess: destroySuccess, isError: destroyError, data: destroyData, error: destroyErr } = useDestroyLocationMutation();

    const buildPayload = () => ({
        imeiNos: selectedStudents,
        divisionId: parentId,
        usedId: userDetail.data.result.divisionId,
        fromStartTime: toEpoch(fromStartDate),
        fromEndTime: toEpoch(fromEndDate),
        toStartTime: toEpoch(toStartDate),
        toEndTime: toEpoch(toEndDate),
    });

    const handleTransfer = () => transfer(buildPayload());
    const handleRevert = () => revert(buildPayload());
    const handleDestroy = () => destroy(buildPayload());

    const anyPending = transferPending || revertPending || destroyPending;
    const isDisabled = selectedStudents.length === 0 || !parentId || anyPending;

    return (
        <>
            <div className="flex gap-3 items-center mb-3">
                <div className="flex-1">
                    <ParentDataSearchSelect
                        setInputData={(id) => { setParentId(id); setSelectedStudents([]); }}
                        divisionId={parentId}
                        placeHolder="Select parent" />
                </div>

                {/* <div className="flex-1">
                    <Input
                        value={searchTerm}
                        onChange={(e) => onSelectDevice(e.target.value)}
                        className="!bg-white w-96"
                        placeholder="Search students... 1,2,3,4,5" />

                    <Button>
                        Select Student
                    </Button>
                </div> */}

            </div>

            <div className="flex gap-3 mb-6 w-full items-center">
                <div className="flex-1">
                    <MultiStudentSelect
                        divisionId={parentId}
                        selected={selectedStudents}
                        onChange={setSelectedStudents}
                    />
                </div>
            </div>

            <div className="flex gap-4 w-full">
                <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Source Date Range</p>
                    <p className="text-xs text-gray-400 mb-2">Date range of the location data you want to transfer</p>
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Start</span>
                            <DatePicker
                                selected={fromStartDate}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="py-1.5 border-2 rounded px-2 text-center border-black text-sm w-full"
                                onChange={(d) => setFromStartDate(d ?? new Date())}
                                placeholderText="From Start Date"
                                wrapperClassName="w-full"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-xs text-gray-500">End</span>
                            <DatePicker
                                selected={fromEndDate}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="py-1.5 border-2 rounded px-2 text-center border-black text-sm w-full"
                                onChange={(d) => setFromEndDate(d ?? new Date())}
                                placeholderText="From End Date"
                                wrapperClassName="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Target Date Range</p>
                    <p className="text-xs text-gray-400 mb-2">Date range into which the data will be transferred</p>
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Start</span>
                            <DatePicker
                                selected={toStartDate}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="py-1.5 border-2 rounded px-2 text-center border-black text-sm w-full"
                                onChange={(d) => setToStartDate(d ?? new Date())}
                                placeholderText="To Start Date"
                                wrapperClassName="w-full"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-xs text-gray-500">End</span>
                            <DatePicker
                                selected={toEndDate}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="dd/MM/yyyy HH:mm"
                                className="py-1.5 border-2 rounded px-2 text-center border-black text-sm w-full"
                                onChange={(d) => setToEndDate(d ?? new Date())}
                                placeholderText="To End Date"
                                wrapperClassName="w-full"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                size="sm"
                                disabled={isDisabled}
                                onClick={handleDestroy}
                                className="!bg-orange-600 !text-white whitespace-nowrap"
                            >
                                {destroyPending ? "Destroying..." : "Destroy Location"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-end gap-3 mt-5">
                <Button
                    size="lg"
                    disabled={isDisabled}
                    onClick={handleTransfer}
                    className="!bg-primaryDark !text-white whitespace-nowrap"
                >
                    {transferPending ? "Transferring..." : "Location Transfer"}
                </Button>
                <Button
                    size="lg"
                    disabled={isDisabled}
                    onClick={handleRevert}
                    className="!bg-red-600 !text-white whitespace-nowrap"
                >
                    {revertPending ? "Reverting..." : "Revert Transfer"}
                </Button>
            </div>
            <div className="mt-6 w-full">
                <div className="w-full flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-white text-center min-h-[80px]">
                    {anyPending && (
                        <>
                            <span className="animate-spin text-2xl text-blue-400 mb-2">⟳</span>
                            <p className="text-xs text-gray-500">
                                {transferPending ? "Transferring…" : revertPending ? "Reverting…" : "Destroying…"}
                            </p>
                        </>
                    )}
                    {!anyPending && (transferSuccess || revertSuccess || destroySuccess) && (
                        <>
                            <span className="text-2xl mb-2">✓</span>
                            <p className="text-xs font-semibold text-green-700">
                                {transferSuccess ? "Transfer Successful" : revertSuccess ? "Revert Successful" : "Destroy Successful"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 break-words">
                                {transferSuccess
                                    ? (transferData?.data.data.result ?? transferData?.data.message)
                                    : revertSuccess
                                    ? (revertData?.data.data.result ?? revertData?.data.message)
                                    : (destroyData?.data.data.result ?? destroyData?.data.message)}
                            </p>
                        </>
                    )}
                    {!anyPending && (transferError || revertError || destroyError) && !(transferSuccess || revertSuccess || destroySuccess) && (
                        <>
                            <span className="text-2xl mb-2">✕</span>
                            <p className="text-xs font-semibold text-red-600">
                                {transferError ? "Transfer Failed" : revertError ? "Revert Failed" : "Destroy Failed"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 break-words">
                                {((transferErr ?? revertErr ?? destroyErr) as Error)?.message}
                            </p>
                        </>
                    )}
                    {!anyPending && !transferSuccess && !revertSuccess && !destroySuccess && !transferError && !revertError && !destroyError && (
                        <p className="text-xs text-gray-400 leading-relaxed">Response will appear here after transfer, revert, or destroy</p>
                    )}
                </div>
            </div>

        </>
    );
};

export default BulkLocationChange;
