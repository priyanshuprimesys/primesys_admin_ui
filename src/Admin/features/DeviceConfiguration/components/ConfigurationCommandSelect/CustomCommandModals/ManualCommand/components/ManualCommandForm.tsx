import { Form, Formik, FormikProps } from "formik"
import { DeviceManualCommandInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceManualCommandInitialState"
import { ManualCommandValidation } from "../hooks/ManualCommandValidation"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext"
import { IDeviceManualCommandInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceManualCommandInterface"
import CustomFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikInput"
import Button from "../../../../../../../../global/components/button/Button"
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext"

const ManualCommandForm = () => {

    const { setDeviceCommand } = useContext(DeviceCommandContext);
    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const {studentSelectedDevices,setStudentSelectedDevices} = useContext(DeviceStudentSelectContext);


    return (
        <div>
            <Formik
                initialValues={DeviceManualCommandInitialState}
                validationSchema={ManualCommandValidation}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        studentSelectedDevices.forEach((student)=>{
                            student.command = values.manualCommand
                        });
                        setStudentSelectedDevices(studentSelectedDevices);
                        setDeviceCommand(`${values.manualCommand}`);

                        setCustomCommand(false);
                        action.setSubmitting(false);
                    }, 600);
                }}
                onReset={() => {

                }}
            >
                {
                    ({ resetForm }: FormikProps<IDeviceManualCommandInterface>) => (
                        <Form>
                            <CustomFormikInput
                                label="Enter Command Manually"
                                name="manualCommand"
                                type="text"
                                placeHolder="Enter Command Manually"
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

export default ManualCommandForm
