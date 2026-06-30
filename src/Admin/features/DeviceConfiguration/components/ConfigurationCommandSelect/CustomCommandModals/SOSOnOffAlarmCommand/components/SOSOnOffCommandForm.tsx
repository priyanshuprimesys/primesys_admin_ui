import { Form, Formik, FormikProps } from "formik"
import { SOSOnOffValidation } from "../hooks/SOSOnOffValidation"
import { DeviceCommandSOSOnOffAlarmInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceCommandSOSOnOffAlarmInitialState"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext"
import { IDeviceCommandSOSOnOffAlarmInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandSOSOnOffAlarmInterface"
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput"
import Button from "../../../../../../../../global/components/button/Button"
import CustomFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikInput"
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext"

const SOSOnOffCommandForm = () => {

    const { setDeviceCommand } = useContext(DeviceCommandContext);
    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const {studentSelectedDevices} = useContext(DeviceStudentSelectContext);



    return (
        <div>
            <Formik
                validationSchema={SOSOnOffValidation}
                initialValues={DeviceCommandSOSOnOffAlarmInitialState}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        setDeviceCommand(`SOSALM,${values.sosOnOffAlarm},${values.sosNumber}`);
                        studentSelectedDevices.forEach((student)=>{
                            student.command = `SOSALM,${values.sosOnOffAlarm},${values.sosNumber}`
                        });
                        setCustomCommand(false);
                        action.setSubmitting(false);
                    }, 600);
                }}
                onReset={() => {
                    setCustomCommand(false);
                }}
            >
                {
                    ({ resetForm }: FormikProps<IDeviceCommandSOSOnOffAlarmInterface>) => (
                        <Form>
                            <h2 className="text-base font-semibold">
                                Select ON/OFF
                            </h2>
                            <div className="flex mt-2 space-x-4">
                                <CustomFormikRadioInput
                                    label="ON"
                                    name="sosOnOffAlarm"
                                    value="ON"
                                />
                                <CustomFormikRadioInput
                                    label="OFF"
                                    name="sosOnOffAlarm"
                                    value="OFF"
                                />
                            </div>

                            <div className="mt-4 mb-4">
                                <CustomFormikInput
                                name="sosNumber"
                                label="Enter 1/2/3"
                                type="number"
                                placeHolder="Enter Number"
                                />
                            </div>

                            <div className="flex mt-4">
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

export default SOSOnOffCommandForm
