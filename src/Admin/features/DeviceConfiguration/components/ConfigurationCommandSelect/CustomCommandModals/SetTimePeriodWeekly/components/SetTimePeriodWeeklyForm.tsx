import { Form, Formik, FormikProps } from "formik"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import CustomSelectFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomSelectFormikInput";
import { IDeviceCommandTimePeriodWeeklyInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandTimePeriodWeeklyInterface";
import { DeviceCommandTimePeriodWeeklyInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceCommandTimePeriodWeeklyInitialState";
import Button from "../../../../../../../../global/components/button/Button";

const SetTimePeriodWeeklyForm = () => {

    const {setDeviceCommand} = useContext(DeviceCommandContext);
    const {setCustomCommand} = useContext(StudentDeviceDetailContext);


  return (
    <div>
      <Formik
      initialValues={DeviceCommandTimePeriodWeeklyInitialState}
      onSubmit={(_values,action)=>{
        setTimeout(() => {
            setDeviceCommand('');
            setCustomCommand(false);
            action.setSubmitting(false);
        }, 600);
      }}
      onReset={()=>{
        setCustomCommand(false);
      }}
      >
        {
            ({resetForm}: FormikProps<IDeviceCommandTimePeriodWeeklyInterface>)=>(
                <Form>
                    <CustomSelectFormikInput
                    label="Select Day"
                    name="timePeriodDay"
                    placeHolder="Please select a day"
                    >

                    </CustomSelectFormikInput>

                    <div className="flex mt-4">
                        <Button type="button" name="Cancel" onHandleSubmit={resetForm} success={false}/>
                        <Button type="submit" name="Submit" success={true}/>
                    </div>
                </Form>
            )
        }
      </Formik>
    </div>
  )
}

export default SetTimePeriodWeeklyForm
