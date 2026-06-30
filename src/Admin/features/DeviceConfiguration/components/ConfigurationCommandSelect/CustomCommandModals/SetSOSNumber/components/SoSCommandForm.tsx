import { Form, Formik, FormikProps } from "formik";
import { DeviceCommandSoSCommandInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceCommandSoSCommandInitialState";
import { useContext } from "react";
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { IDeviceCommandSetSoSCommandInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandSetSoSCommandInterface";
import CustomFormikInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikInput";
import Button from "../../../../../../../../global/components/button/Button";
import CustomFormikRadioInput from "../../../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput";
import { SoSCommandValidation } from "../hooks/SoSCommandValidation";
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";






const SoSCommandForm = () => {

    const { setCustomCommand } = useContext(StudentDeviceDetailContext);
    const {setDeviceCommand} = useContext(DeviceCommandContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);


    return (
        <>
            <div>
                <Formik
                    initialValues={DeviceCommandSoSCommandInitialState}
                    validationSchema={SoSCommandValidation}
                    onSubmit={(values, action) => {
                        setTimeout(() => {
                            setDeviceCommand(`SOS,A,${values.sosNumberOne},${values.sosNumberTwo},${values.sosAdminNumber}`);
                            studentSelectedDevices.forEach((student)=>{
                                student.command = `SOS,A,${values.sosNumberOne},${values.sosNumberTwo},${values.sosAdminNumber}`
                            });
                            setCustomCommand(false);
                            action.setSubmitting(false);
                        }, 600);
                    }}
                    onReset={() => {
                        setCustomCommand(false);
                    }}
                >
                    {({ resetForm }: FormikProps<IDeviceCommandSetSoSCommandInterface>) => (
                        <Form>
                            <CustomFormikInput
                                label="Enter SOS No-1"
                                name="sosNumberOne"
                                type="text"
                                placeHolder="Enter Family Number-1"
                            />

                            <CustomFormikInput
                                label="Enter SOS No-2"
                                name="sosNumberTwo"
                                type="text"
                                placeHolder="Enter Family Number-2"
                            />

                            
                            <h3 className="m-0 font-semibold">Select Admin Number:</h3>
                            <div className="flex mt-2 space-x-4">

                                <div>
                                <label htmlFor="" className="text-sm font-semibold">Airtel</label>
                                <CustomFormikRadioInput
                                    name="sosAdminNumber"
                                    label="9766711066"
                                    value="9766711066"
                                />
                                </div>
                              
                              <div>
                              <label htmlFor="" className="text-sm font-semibold">JIO</label>
                              <CustomFormikRadioInput
                                    name="sosAdminNumber"
                                    label="9209253678"
                                    value="9209253678"
                                />
                              </div>
                               
                            </div>

                            <div className="flex mt-4">
                                <Button name="Cancel" type="button" success={false} onHandleSubmit={resetForm} />
                                <Button name="Submit" type="submit" success={true}  />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}



export default SoSCommandForm;