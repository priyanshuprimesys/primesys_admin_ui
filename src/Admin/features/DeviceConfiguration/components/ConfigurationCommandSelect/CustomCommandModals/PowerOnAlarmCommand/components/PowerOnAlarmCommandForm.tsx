import { Form, Formik, FormikProps } from "formik"
import {  useContext } from "react"
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext"
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { DevicePowerOnAlarmCommandInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DevicePowerOnAlarmCommandInitialState";
import { IDevicePowerOnAlarmCommandInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DevicePowerOnAlarmCommandInterface";
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput";
import Button from "../../../../../../../../global/components/button/Button";
import { PowerOnAlarmValidation } from "../hooks/PowerOnAlarmValidation";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";


const PowerOnAlarmCommandForm = () => {


    const { setDeviceCommand } = useContext(DeviceCommandContext);
    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);



    return (
        <div>
            <Formik
                initialValues={DevicePowerOnAlarmCommandInitialState}
                validationSchema={PowerOnAlarmValidation}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        setCustomCommand(false);
                        setDeviceCommand(`PWRONALM,${values.powerOnAlarm},${values.powerOnAlarmBool}`);
                        studentSelectedDevices.forEach((student)=>{
                            student.command =`PWRONALM,${values.powerOnAlarm},${values.powerOnAlarmBool}`
                        });
                        action.setSubmitting(false);
                    }, 700);
                }}
                onReset={() => {
                    setCustomCommand(false)
                }}
            >
                {
                    ({ resetForm }: FormikProps<IDevicePowerOnAlarmCommandInterface>) => (
                        <Form>
                            <h2 className="mb-1 text-base font-semibold">Select ON/OFF</h2>
                            <div className="flex mb-2 space-x-4">
                                <CustomFormikRadioInput
                                    name="powerOnAlarm"
                                    label="ON"
                                    value="ON"
                                />
                                <CustomFormikRadioInput
                                    name="powerOnAlarm"
                                    label="OFF"
                                    value="OFF"
                                />
                            </div>

                            <h2 className="mb-1 text-base font-semibold">Select 1/0</h2>
                            <div className="flex mb-2 space-x-4">
                                <CustomFormikRadioInput
                                    name="powerOnAlarmBool"
                                    label="1"
                                    value="1"
                                />
                                <CustomFormikRadioInput
                                    name="powerOnAlarmBool"
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

export default PowerOnAlarmCommandForm
