import { Form, Formik, FormikProps } from "formik"
import { useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { DevicePowerOffAlarmCommandInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DevicePowerOffAlarmCommandInitialState";
import { IDevicePowerOffAlarmCommandInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DevicePowerOffAlarmCommandInterface";
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput";
import Button from "../../../../../../../../global/components/button/Button";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";

const PowerOffAlarmCommandForm = () => {

    const { setDeviceCommand } = useContext(DeviceCommandContext);
    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);


    return (
        <div>
            <Formik
                initialValues={DevicePowerOffAlarmCommandInitialState}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        setCustomCommand(false);
                        setDeviceCommand(`PWROFFALM,${values.powerOffAlarm},${values.powerOffAlarmBool}`);
                        studentSelectedDevices.forEach((student)=>{
                            student.command = `PWROFFALM,${values.powerOffAlarm},${values.powerOffAlarmBool}`
                        });
                        action.setSubmitting(false);
                    }, 700);
                }}
                onReset={() => {
                    setCustomCommand(false);
                }}
            >
                {
                    ({ resetForm }: FormikProps<IDevicePowerOffAlarmCommandInterface>) => (
                        <Form>
                            <h2 className="text-base font-semibold">
                                Select ON OFF
                            </h2>
                            <div className="flex mb-2 space-x-4">
                                <CustomFormikRadioInput
                                    name="powerOffAlarm"
                                    label="ON"
                                    value="ON"
                                />
                                <CustomFormikRadioInput
                                    name="powerOffAlarm"
                                    label="OFF"
                                    value="OFF"
                                />
                            </div>


                            <h2 className="text-base font-semibold">
                                Select 1/0
                            </h2>

                            <div className="flex mb-2 space-x-4">
                                <CustomFormikRadioInput
                                    name="powerOffAlarmBool"
                                    label="1"
                                    value="1"
                                />
                                <CustomFormikRadioInput
                                    name="powerOffAlarmBool"
                                    label="0"
                                    value="0"
                                />
                            </div>

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

export default PowerOffAlarmCommandForm
