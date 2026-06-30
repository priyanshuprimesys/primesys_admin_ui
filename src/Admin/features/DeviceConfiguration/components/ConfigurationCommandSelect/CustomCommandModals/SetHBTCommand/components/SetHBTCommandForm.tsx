import { Form, Formik, FormikProps } from "formik"
import { DeviceHBTInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceHBTCommandInitialState"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext"
import { IDeviceHBTinterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceHBTCommandInterface"
import CustomFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikInput"
import Button from "../../../../../../../../global/components/button/Button"
import { HBTValidation } from "../hooks/HBTValidation"
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext"

const SetHBTCommandForm = () => {

  const { setDeviceCommand } = useContext(DeviceCommandContext);
  const { setCustomCommand } = useContext(StudentDeviceDetailContext);
  const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);



  return (
    <div>
      <Formik
        initialValues={DeviceHBTInitialState}
        validationSchema={HBTValidation}
        onSubmit={(values, action) => {
          setTimeout(() => {
            setDeviceCommand(`HBT,${values.hbtTime}`);
            studentSelectedDevices.forEach((student)=>{
              student.command = `HBT,${values.hbtTime}`
            });
            setCustomCommand(false);
            action.setSubmitting(false);
          }, 700);
        }}
        onReset={() => {
          setCustomCommand(false);
        }}
      >
        {
          ({ resetForm }: FormikProps<IDeviceHBTinterface>) => (
            <Form>
              <CustomFormikInput
                label="Enter Time"
                placeHolder="Enter Time Between 1 to 300 Minute"
                name="hbtTime"
                type="number"
              />
              <div className="flex mt-4">
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

export default SetHBTCommandForm
