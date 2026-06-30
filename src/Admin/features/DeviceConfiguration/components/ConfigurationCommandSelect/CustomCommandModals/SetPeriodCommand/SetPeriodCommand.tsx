import { useContext } from "react";
import Button from "../../../../../../../global/components/button/Button";
import InputTimer from "./components/InputComponent/InputTimer";
import { StudentDeviceDetailContext } from "../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { DeviceCommandContext } from "../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { useErrorNotification } from "../../../../../../../utils/hooks/notification/useErrorNotification";
import { useSuccessNotification } from "../../../../../../../utils/hooks/notification/useSuccessNotification";
import { DeviceStudentSelectContext } from "../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";
import _ from "lodash";
import { UserDetailContext } from "../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";






const SetPeriodCommand = () => {


    const { setDeviceCommand, setEndTimeOne, setEndTimeTwo, setStartTimeOne, setStartTimeTwo, startTimeOne, startTimeTwo, endTimeOne, endTimeTwo } = useContext(DeviceCommandContext);
    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const { studentSelectedDevices, setStudentSelectedDevices } = useContext(DeviceStudentSelectContext);
    const { userDetail } = useContext(UserDetailContext);


    const onHandleSubmit = () => {
        console.log("Submitting period command...");
        if (startTimeOne == '' && endTimeOne == '' && startTimeTwo == '' && endTimeTwo == '') {
            setDeviceCommand('');
            useErrorNotification('No Time Selected');
        }
        else {
            const setUniqueStudentList = _.uniqBy(studentSelectedDevices.flat(), 'device_imei');


            if (studentSelectedDevices.length > 0) {
                let periodCommand: any[] = [];
                let periodStudent;
                setUniqueStudentList.forEach((student) => {
                    for (let i = 0; i < 3; i++) {
                        periodStudent = {
                            device_imei: student.device_imei,
                            command: startTimeTwo != '' ? `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo}` : `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne}`,
                            device_name: student.device_name,
                            login_name: userDetail.data.result.userName,
                            division_id: student.division_id
                        }
                        periodCommand.push(periodStudent);
                    }
                });
                setStudentSelectedDevices(periodCommand);

            }
            if (startTimeTwo != '' && endTimeTwo != '') {
                setDeviceCommand(`PERIOD,1,1,0,${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo},PERIOD,1,1,1,${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo},PERIOD,1,1,2,${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo}`);
            }
            else {
                setDeviceCommand(`PERIOD,1,1,0,${startTimeOne}-${endTimeOne},PERIOD,1,1,1,${startTimeOne}-${endTimeOne},PERIOD,1,1,2,${startTimeOne}-${endTimeOne}`);
            }
            useSuccessNotification('Command Saved!');
        }
        setCustomCommand(false);
    }

    const onCancelSubmit = () => {
        setCustomCommand(false);
        setDeviceCommand('');
        setEndTimeOne('');
        setStartTimeOne('');
        setStartTimeTwo('');
        setEndTimeTwo('');
    }




    return (
        <>
            <div>
                <form>
                    <p className="m-0 text-xss">Set 24-hour Time Period</p>
                    <div className="flex gap-4 mt-1">
                        <InputTimer
                            timeInput={startTimeOne}
                            setTimeInput={setStartTimeOne}
                            placeHolder="Enter Start Time 1" />

                        <InputTimer
                            timeInput={endTimeOne}
                            setTimeInput={setEndTimeOne}
                            placeHolder="Enter End Time 1" />
                    </div>
                    <div className="mt-4">
                        <p className="m-0 text-xss">
                            Set Shift Timings for Patrolman(Shift exist within two days)
                        </p>
                        <div className="flex gap-4 mt-2">
                            <InputTimer
                                timeInput={startTimeTwo}
                                setTimeInput={setStartTimeTwo}
                                placeHolder="Enter Start Time 2" />

                            <InputTimer
                                timeInput={endTimeTwo}
                                setTimeInput={setEndTimeTwo}
                                placeHolder="Enter End Time 2" />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <Button success={false} onHandleSubmit={onCancelSubmit} />
                        <Button success={true} onHandleSubmit={onHandleSubmit} />
                    </div>
                </form>
            </div>

        </>
    )
}




export default SetPeriodCommand;