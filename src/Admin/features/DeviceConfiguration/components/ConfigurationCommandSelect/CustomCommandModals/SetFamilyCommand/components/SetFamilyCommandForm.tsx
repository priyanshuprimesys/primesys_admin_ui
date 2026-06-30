import { Form, Formik, FormikProps } from "formik"
import { DeviceCommandSetFamilyInitialState } from "../../../../../../../../initialStates/AppInitialStates/DeviceCommandInitialState/DeviceCommandSetFamilyInitialState"
import { IDeviceCommandSetFamilyFormInterface } from "../../../../../../../../interfaces/AppInterfaces/DeviceCommandInterface/DeviceCommandSetFamilyFormInterface";
import CustomInput from "./CustomInput";
import { StudentDeviceDetailContext } from "../../../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { useContext } from "react";
import Button from "../../../../../../../../global/components/button/Button";
import { familyCommandSchema } from "../hooks/FamilyCommadValidationSchema";
import { DeviceCommandContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { DeviceStudentSelectContext } from "../../../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";








const SetFamilyCommandForm = () => {

    const { setCustomCommand} = useContext(StudentDeviceDetailContext);
    const {setDeviceCommand} = useContext(DeviceCommandContext);
    const { studentSelectedDevices } = useContext(DeviceStudentSelectContext);


    return (
        <div>
            <Formik
                initialValues={DeviceCommandSetFamilyInitialState}
                validationSchema={familyCommandSchema}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        action.setSubmitting(false);
                        studentSelectedDevices.forEach((student)=>{
                            student.command =`FN,A,PAPA,${values.familyNumberOne},MUMMY,${values.familyNumberTwo},UNCLE,${values.familyNumberThree}`
                        });
                        setCustomCommand(false);
                        setDeviceCommand(`FN,A,PAPA,${values.familyNumberOne},MUMMY,${values.familyNumberTwo},UNCLE,${values.familyNumberThree}`);
                    }, 1000);
                }}
                onReset={() => {
                    setCustomCommand(false);
                }}
            >
                {
                    ({ resetForm }: FormikProps<IDeviceCommandSetFamilyFormInterface>) => (
                        <Form>
                            <CustomInput
                                label="Enter Family No 1"
                                name="familyNumberOne"
                                type="number"
                                placeHolder="Enter Family Number-1" />
                            <CustomInput
                                label="Enter Family No 2"
                                name="familyNumberTwo"
                                type="number"
                                placeHolder="Enter Family Number-2" />
                            <CustomInput
                                label="Enter Family No 3"
                                name="familyNumberThree"
                                type="number"
                                placeHolder="Enter Family Number-3" />
                            <div className="flex mt-4">
                                <Button name="Cancel" type="button" success={false} onHandleSubmit={resetForm} />
                                <Button name="Submit" type="submit" success={true} />
                            </div>
                        </Form>
                    )
                }

            </Formik>
        </div>
    )
}

export default SetFamilyCommandForm
