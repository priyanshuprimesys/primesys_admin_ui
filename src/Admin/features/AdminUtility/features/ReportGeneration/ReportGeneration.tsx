import { useContext, useEffect, useState } from "react";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import DeviceTypeSelect from "./components/DeviceSelect/DeviceSelect";
import ReportDate from "./components/ReportDate/ReportDate";
import ShiftSelect from "./components/ShiftSelect/ShiftSelect";
import StudentDeviceSelect from "./components/StudentDeviceSelect/StudentDeviceSelect";
import ReportButton from "./components/ReportButton/ReportButton";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { usePostGenerateReport } from "./hooks/GenerateReportHooks";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";
import { ReportResponseInitialState } from "./initialState/ReportResponseInitialState";
import ReportStatusSelect from "./components/ReportStatusSelect/ReportStatusSelect";
import { ReportStatus } from "./util/ReportStatusType";
import { useQueryClient } from "@tanstack/react-query";
import AllDivisionInfo from "./components/AllDivisionInfo/AllDivisionInfo";
import { useGenerateOtp } from "./hooks/GenerateOtpHooks";
import { useVerifyOtp } from "./hooks/VerifyOtpHooks";
import { OtpVerifyInitialState } from "./initialState/OtpVerifyInitialState";
import { IReportGenerateResponseInterface } from "./interfaces/IReportGenerateResponse";




const ReportGeneration = () => {
    const [parentId, setParentId] = useState<string>("");
    const [parentName, setParentName] = useState<string>("");
    const [studentDeviceType, setStudentDeviceType] = useState<string>("");
    const [shiftType, setShiftType] = useState<string>("");
    const [studentReportDevices, setStudentReportDevices] = useState<string>('');
    const [reportDate, setReportDate] = useState<Date | null>(new Date());
    const { userDetail } = useContext(UserDetailContext);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { mutate, isPending, data, error } = usePostGenerateReport();
    const [reportStatusType, setReportStatusType] = useState<string>(ReportStatus.division);
    const queryClient = useQueryClient();
    const { mutate: otpMutate } = useGenerateOtp();
    const { mutate: verifyMutate, data: verifyData } = useVerifyOtp();
    const [reportData, setReportData] = useState<IReportGenerateResponseInterface>(ReportResponseInitialState);
    const [reportError, setReportError] = useState<string>('');

    const [otpOne, setOtpOne] = useState<string>('');
    const [otpTwo, setOtpTwo] = useState<string>('');
    const [otpThree, setOtpThree] = useState<string>('');
    const [otpFour, setOtpFour] = useState<string>('');
    const [otpFive, setOtpFive] = useState<string>('');
    const [otpSix, setOtpSix] = useState<string>('');

    const otpString = [otpOne, otpTwo, otpThree, otpFour, otpFive, otpSix];


    useEffect(() => {
        if (data) {
            setReportData(data.data);
            // onClose();
        }
        else if (error) {
            setReportError(error.message);
            // onClose();
        }
    }, [data, error]);




    const toast = useToast();

    const onHandleClick = () => {
        if (reportStatusType === ReportStatus.allDivision) {
            if (studentDeviceType === "" || shiftType === "") {
                toast({
                    status: "error",
                    title: "Please do not leave any field",
                    duration: 1200,
                })
                return;
            }
            onOpen();
            if (reportStatusType === ReportStatus.allDivision) {
                otpMutate({ userId: userDetail.data.result.userName });
            }
        } else {
            if (parentId === "" || studentDeviceType === "" || shiftType === "") {
                toast({
                    status: "error",
                    title: "Please do not leave any field",
                    duration: 1200,
                })
                return;
            }
            if (studentReportDevices.length < 1) {
                toast({
                    status: "info",
                    title: "Please select devices first",
                    duration: 1800,
                    isClosable: true,
                    variant: 'subtle'
                })
                return;
            }
            if (reportDate) {
                onOpen();
            }
        }

    }

    const handleReportGenerate = () => {
        if (reportDate) {
            const todayDate = new Date();
            const diffInTime = todayDate.getTime() - reportDate.getTime();
            const diffInDays: number = Math.round(diffInTime / (1000 * 3600 * 24));
            mutate({
                division_id: reportStatusType === ReportStatus.division ? parentId : "0",
                device_type_id: Number(studentDeviceType),
                report_day: diffInDays,
                shift_type: Number(shiftType),
                device_list: reportStatusType === ReportStatus.division ? studentReportDevices : "",
                user_id: userDetail.data.result.userName,
                trip_wise_report: false
            });
        }
    }

    const onHandleReportStatus = (text: string) => {
        queryClient.clear()
        setReportStatusType(text);
        setParentId("");
        setParentName("");
        setStudentDeviceType("");
        setShiftType("");
        setStudentReportDevices("");
        setReportDate(new Date());
    }


    const handleOtpVerify = () => {
        verifyMutate({
            userId: userDetail.data.result.userName,
            otp: otpString.join('')
        })
    }


    const handleCloseModal = () => {
        setReportData(ReportResponseInitialState);
        setReportError('');
        onClose();
    }


    return (
        <>
            <div className="mb-4">
                <h1 className="text-base font-semibold">Report Status Type</h1>
                <ReportStatusSelect
                    onHandleSelect={onHandleReportStatus}
                />
            </div>
            <div className="flex gap-2">
                {
                    reportStatusType === ReportStatus.division ?
                        <ParentDataSearchSelect
                            setInputData={setParentId}
                            setParentName={setParentName}
                            placeHolder="Select division name"
                        />
                        :
                        ''

                }

                <DeviceTypeSelect selectValue={studentDeviceType} disabled={false} setSelectValue={setStudentDeviceType} />
                <ShiftSelect selectValue={shiftType} setSelectValue={setShiftType} />
                <ReportDate startDate={reportDate} setReportDate={setReportDate} />
                <ReportButton onHandleClick={onHandleClick} />
            </div>
            {
                reportStatusType === ReportStatus.division
                    ?
                    <div className="w-full px-2 py-2 mt-2 border-2 border-gray-500 rounded">
                        <StudentDeviceSelect deviceTypeID={studentDeviceType} divisionId={parentId} studentDevices={studentReportDevices} setStudentDevices={setStudentReportDevices} />
                    </div>
                    :
                    <AllDivisionInfo deviceType={studentDeviceType} shiftType={shiftType} reportDate={reportDate} />
            }

            {
                isOpen &&
                <ConfirmationModal
                    onHandleCloseModal={handleCloseModal}
                    reportStatus={reportStatusType}
                    data={data ? reportData : ReportResponseInitialState}
                    isPending={isPending}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmitAction={handleReportGenerate}
                    parentName={parentName}
                    reportDate={reportDate}
                    setOtpOne={setOtpOne}
                    setOtpTwo={setOtpTwo}
                    setOtpFive={setOtpFive}
                    setOtpFour={setOtpFour}
                    setOtpSix={setOtpSix}
                    setOtpThree={setOtpThree}
                    onHandleVerify={handleOtpVerify}
                    errorMessage={reportError}
                    otpData={verifyData ? verifyData.data : OtpVerifyInitialState}
                />
            }
        </>

    )
}



export default ReportGeneration