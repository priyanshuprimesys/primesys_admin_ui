import { useContext } from "react"
import CustomModal from "../../../../../../global/components/CustomModal/CustomModal"
import { StudentDeviceDetailContext } from "../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext"
import SetPeriodCommand from "./SetPeriodCommand/SetPeriodCommand";
import SetTimerCommand from "./SetTimerCommand/SetTimerCommand";
import SetFamilyCommand from "./SetFamilyCommand";
import SetSOSNumber from "./SetSOSNumber/SetSOSNumber";
import SetGMTCommand from "./SetGMTCommand/SetGMTCommand";
import PowerOnAlarmCommand from "./PowerOnAlarmCommand/PowerOnAlarmCommand";
import PowerOffAlarmCommand from "./PoweOffAlarmCommand/PowerOffAlarmCommand";
import SimChangeOnOffAlarmCommand from "./SimChangeOnOffAlarmCommand/SimChangeOnOffAlarmCommand";
import SetHBTCommand from "./SetHBTCommand/SetHBTCommand";
import SOSOnOffAlarmCommand from "./SOSOnOffAlarmCommand/SOSOnOffAlarmCommand";
import LowBatteryOnAlarmCommand from "./LowBatteryOnAlarmCommand/LowBatteryOnAlarmCommand";
import ManualCommand from "./ManualCommand/ManualCommand";


const CustomCommandModal = () => {

  const { customCommand, setCustomCommand,selectedCommand } = useContext(StudentDeviceDetailContext);


  return (
    <>
      {
        customCommand &&
        <CustomModal
          modalHeader={selectedCommand}
          setModalActive={setCustomCommand}>
            {selectedCommand == "Set Period" && <SetPeriodCommand /> }
            {selectedCommand == "Set Timer" && <SetTimerCommand/>}
            {selectedCommand == "Set Family No" && <SetFamilyCommand/>}
            {selectedCommand == "Set SOS No" && <SetSOSNumber/>}
            {selectedCommand == "Set GMT" && <SetGMTCommand/>}
            {selectedCommand == "Power ON Alm" && <PowerOnAlarmCommand/>}
            {selectedCommand == "Power OFF Alm" && <PowerOffAlarmCommand/>}
            {selectedCommand == "SimCard Change On/Off Alm" && <SimChangeOnOffAlarmCommand/>}
            {selectedCommand == "Set HBT" && <SetHBTCommand/>}
            {selectedCommand == "SOS On/Off Alm" && <SOSOnOffAlarmCommand/>}
            {selectedCommand == "Low battery ON alarm" && <LowBatteryOnAlarmCommand/>}
            {selectedCommand == "Other" && <ManualCommand/>}
        </CustomModal>
      }

    </>
  )
}

export default CustomCommandModal
