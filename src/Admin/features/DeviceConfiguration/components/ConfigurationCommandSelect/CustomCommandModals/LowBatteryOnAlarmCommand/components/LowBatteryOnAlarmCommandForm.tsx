import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { Form, Formik, FormikProps } from "formik";
import { DeviceCommandLowBatteryOnAlarmInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceCommandLowBatteryOnAlarmInitialState";
import { LowBatteryValidation } from "../hooks/LowBatteryValidation";
import { IDeviceCommandLowBatteryOnAlarmInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandLowBatteryOnAlarmInterface";
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput";
import Button from "../../../../../../../../global/components/button/Button";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";

const LowBatteryOnAlarmCommandForm = () => {

    const {setDeviceCommand}= useContext(DeviceCommandContext);
    const {setCustomCommand} = useContext(StudentDeviceDetailContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);


  return (
    <div>
      <Formik
      initialValues={DeviceCommandLowBatteryOnAlarmInitialState}
      validationSchema={LowBatteryValidation}
      onSubmit={(values,action)=>{
        setTimeout(() => {
            setDeviceCommand(`BATALM,${values.lowBatteryOnOff},${values.lowBatteryNumber}`);
            studentSelectedDevices.forEach((student)=>{
              student.command = `BATALM,${values.lowBatteryOnOff},${values.lowBatteryNumber}`
            });
            setCustomCommand(false);
            action.setSubmitting(false);
        }, 600);
      }}
      onReset={()=>{
        setCustomCommand(false);
      }}
      >
        {
            ({resetForm}: FormikProps<IDeviceCommandLowBatteryOnAlarmInterface>)=>(
                <Form>
                    <h2 className="text-base font-semibold">
                        Select ON/OFF
                    </h2>
                    <div className="flex mt-2 mb-4 space-x-4">
                        <CustomFormikRadioInput
                        name="lowBatteryOnOff"
                        label="ON"
                        value="ON"
                        />
                        <CustomFormikRadioInput
                        name="lowBatteryOnOff"
                        label="OFF"
                        value="OFF"
                        />
                    </div>
                    <h2 className="text-base font-semibold">
                        Select 1/0
                    </h2>
                    <div className="flex mt-2 mb-4 space-x-4">
                        <CustomFormikRadioInput
                        name="lowBatteryNumber"
                        label="1"
                        value="1"
                        />
                        <CustomFormikRadioInput
                        name="lowBatteryNumber"
                        label="0"
                        value="0"
                        />
                    </div>

                    <div className="flex mt-4">
                        <Button type="button" name="Cancel" onHandleSubmit={resetForm} success={false} />
                        <Button type="submit" name="Submit"  success={true} />
                    </div>
                </Form>
            )
        }
      </Formik>
    </div>
  )
}

export default LowBatteryOnAlarmCommandForm
