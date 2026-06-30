import { useContext, useState } from "react"
import Button from "../../../../../../../global/components/button/Button"
import InputBox from "./components/InputBox/InputBox"
import { DeviceCommandContext } from "../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { StudentDeviceDetailContext } from "../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { useErrorNotification } from "../../../../../../../utils/hooks/notification/useErrorNotification";
import { useSuccessNotification } from "../../../../../../../utils/hooks/notification/useSuccessNotification";
import { DeviceStudentSelectContext } from "../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";




const SetTimerCommand = () => {

  const [lbsTimerInput, setLBSTimerInput] = useState<string>('');
  const [gpsTimerInput, setGPSTimerInput] = useState<string>('');

  const { setDeviceCommand } = useContext(DeviceCommandContext);
  const {setCustomCommand} = useContext(StudentDeviceDetailContext);
  const {studentSelectedDevices} = useContext(DeviceStudentSelectContext);

  const onSuccessSubmit = () => {
    if (lbsTimerInput == '' && gpsTimerInput == '') {
      useErrorNotification('No Time Selected');
      setDeviceCommand('');
    } else {
      if (lbsTimerInput == '') {
        setDeviceCommand(`TIMER,${gpsTimerInput}`);
        studentSelectedDevices.forEach((student)=>{
          student.command = `TIMER,${gpsTimerInput}`
        });
      } else if (gpsTimerInput == '') {
        setDeviceCommand(`TIMER,${lbsTimerInput}`);
        studentSelectedDevices.forEach((student)=>{
          student.command = `TIMER,${lbsTimerInput}`
        });
      } else {
        setDeviceCommand(`TIMER,${lbsTimerInput},${gpsTimerInput}`);
        studentSelectedDevices.forEach((student)=>{
          student.command = `TIMER,${lbsTimerInput},${gpsTimerInput}`
        });
      }
      useSuccessNotification('Command Saved');
    }
    setCustomCommand(false);
  }

  const onCancelSubmit = () => {
    setCustomCommand(false);
    setDeviceCommand('');
  }



  return (
    <div className="gap-4 pt-2 w-72">
      <form>
        <InputBox
          timerInput={lbsTimerInput}
          setTimerInput={setLBSTimerInput}
          placeHolder="Enter LBS Time" />

        <InputBox
          timerInput={gpsTimerInput}
          setTimerInput={setGPSTimerInput}
          placeHolder="Enter GPS Time" />
        <div className="flex mt-3">
          <Button success={false} onHandleSubmit={onCancelSubmit} />
          <Button success={true} onHandleSubmit={onSuccessSubmit} />
        </div>
      </form>
    </div>
  )
}

export default SetTimerCommand
