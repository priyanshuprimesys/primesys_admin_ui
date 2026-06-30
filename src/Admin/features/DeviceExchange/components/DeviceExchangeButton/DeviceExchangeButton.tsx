import { useContext, useEffect, useState } from "react";
import { DeviceExchangeStudentContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";




interface DeviceExchangeProps{
  isPending:boolean;
}



const DeviceExchangeButton: React.FC<DeviceExchangeProps> = ({isPending}) => {

  const {studentDeviceOne,studentDeviceSecond} = useContext(DeviceExchangeStudentContext);
  const [buttonState,setButtonState] = useState<boolean>(true);
  const [buttonStatus,SetButtonStatus] = useState<string>('Select Devices');

  useEffect(()=>{
    if(studentDeviceOne !='' && studentDeviceSecond != ''){
      setButtonState(false);
      SetButtonStatus('Exchange Device');
    }else if(isPending){
      setButtonState(true);
    }else if(studentDeviceOne && studentDeviceSecond && !isPending){
      setButtonState(false);
      SetButtonStatus('Exchange Device');
    }else{
      setButtonState(true);
      SetButtonStatus('Select Devices');
    }
  },[studentDeviceOne,studentDeviceSecond,isPending]);


  return (
    <button type="submit"
    disabled={buttonState}
    className="text-white w-full bg-theme-mutedBlue hover:bg-theme-brightBlue hover:text-white  font-medium rounded-lg text-sm px-5 py-2.5">
      {isPending ? 'Exchanging....' : buttonStatus}
    </button>
  )
}

export default DeviceExchangeButton;
