import { Form, Formik, FormikProps } from "formik"
import { DeviceSimChangeOnOffInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceSimChangeOnOffInitialState"
import { IDeviceSimChangeOnOffInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceSimChangeOnOffInterface"
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput"
import Button from "../../../../../../../../global/components/button/Button"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext"
// import { SimChangeValidation } from "../hooks/SimChangeValidation"
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext"








const SimChangeOnOffAlarmCommandForm = () => {


    const {setDeviceCommand} = useContext(DeviceCommandContext);
    const {setCustomCommand} = useContext(StudentDeviceDetailContext);
    const {studentSelectedDevices} = useContext(DeviceStudentSelectContext);


  return (
    <div>
      <Formik
      initialValues={DeviceSimChangeOnOffInitialState}
      onSubmit={(values,action)=>{
        setTimeout(()=>{
            setDeviceCommand(`SIMALM,${values.simChange},${values.simChangeBool}`);
            studentSelectedDevices.forEach((student)=>{
              student.command = `SIMALM,${values.simChange},${values.simChangeBool}`
            });
            action.setSubmitting(false);
            setCustomCommand(false);
        }, 600);
      }}
      onReset={() =>{
        setCustomCommand(false);
      }}
      >
        {
            ({resetForm}: FormikProps<IDeviceSimChangeOnOffInterface>)=>(
                <Form>
                    <h2 className="text-base font-semibold">
                        Select ON/OFF
                    </h2>
                    <div className="flex mb-2 space-x-4">
                        <CustomFormikRadioInput
                         label="ON"
                         name="simChange"
                         value="ON"
                        />
                        <CustomFormikRadioInput
                         label="OFF"
                         name="simChange"
                         value="OFF"
                        />
                    </div>
                    <h2 className="text-base font-semibold">
                        Select 1/0
                    </h2>
                    <div className="flex mb-2 space-x-4">
                        <CustomFormikRadioInput
                         label="1"
                         name="simChangeBool"
                         value="1"
                        />
                        <CustomFormikRadioInput
                         label="0"
                         name="simChangeBool"
                         value="0"
                        />
                    </div>
                    <div className="flex mt-2">
                        <Button type="button" name="Cancel" onHandleSubmit={resetForm} success={false} />
                        <Button type="submit" name="Submit" success={true} />
                    </div>
                </Form>
            )
        }
      </Formik>
    </div>
  )
}

export default SimChangeOnOffAlarmCommandForm
