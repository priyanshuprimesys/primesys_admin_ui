import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { Form, Formik, FormikProps } from "formik";
import { DeviceGMTCommandInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceGMTCommandInitialState";
import { IDeviceGMTCommandInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceGMTCommandInterface";
import CustomFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikInput";
import Button from "../../../../../../../../global/components/button/Button";
import { GmtCommandValidation } from "../hooks/GmtCommandValidation";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";

const SetGMTCommandForm = () => {

    const {setDeviceCommand} = useContext(DeviceCommandContext);
    const {setCustomCommand} = useContext(StudentDeviceDetailContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);


  return (
    <div>
        <Formik
            initialValues={DeviceGMTCommandInitialState}
            validationSchema={GmtCommandValidation}
            onSubmit={(values,action)=>{
                setTimeout(() => {
                    setCustomCommand(false);
                    setDeviceCommand(`GMT,E,${values.gmtCommandHour},${values.gmtCommandMinute}`);
                    studentSelectedDevices.forEach((student)=>{
                        student.command = `GMT,E,${values.gmtCommandHour},${values.gmtCommandMinute}`
                    });
                    action.setSubmitting(false);
                }, 700);
            }}
            onReset={()=>{
                setCustomCommand(false);
            }}
        >
            {
                ({resetForm}: FormikProps<IDeviceGMTCommandInterface>) =>(
                    <Form>
                        <CustomFormikInput
                        label="Enter Hour"
                        name="gmtCommandHour"
                        placeHolder="Enter Hour"
                        type="number"
                        />
                        <CustomFormikInput
                        label="Enter Minute"
                        name="gmtCommandMinute"
                        placeHolder="Enter Minute"
                        type="number"
                        />

                        <div className="flex">
                            <Button type="button" onHandleSubmit={resetForm} name="Cancel" success={false} />
                            <Button type="submit" name="Submit" success={true} />
                        </div>
                    </Form>
                )
            }
        </Formik>
    </div>
  )
}

export default SetGMTCommandForm
