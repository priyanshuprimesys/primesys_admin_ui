import { Form, Formik, FormikProps } from "formik";
import { HirearchyTrackUserFormikInitialState } from "../../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyTrackUserInitialState/HirearchyTrackUserFormikInitialState";
import { IHirearchyTrackUserFormikRequestInterface } from "../../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserFormikRequestInterface";
import Button from "../../../../../../global/components/button/Button";
import CustomFormikInput from "../../../../../../global/components/input/CustomInputBox/CustomFormikInput";
import CustomFormikRadioInput from "../../../../../../global/components/input/CustomInputBox/CustomFormikRadioInput";
// import { TrackUserValidation } from "../hooks/TrackUserValidation";
import { useContext, useEffect, useState } from "react";
import { HirearchyTrackUserContext } from "../../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyTrackUserContext/HirearchyTrackUserContext";
import { UserDetailContext } from "../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { postDivisionTrackUser } from "../../../../../../api/queries/app/hooks/create-division-track-user-login-api-hooks";
import { useErrorNotification } from "../../../../../../utils/hooks/notification/useErrorNotification";
import { useSuccessNotification } from "../../../../../../utils/hooks/notification/useSuccessNotification";
import { useGetEmailMaster } from "../../../services/hooks";
import ReportEmailInput from "../ReportEmailInput/ReportEmailInput";
import { useQueryClient } from "@tanstack/react-query";
import { division_login_track_user_key } from "../../../../../../api/queries/app/queryKeys/queryKeys";

interface AddTrackUserProps {
    setAddTrackModalShow: (modal: boolean) => void;
}




const AddTrackUserModal: React.FC<AddTrackUserProps> = ({ setAddTrackModalShow }) => {

    const { hirearchyTrackUserRef } = useContext(HirearchyTrackUserContext);
    const [reportEmailId, setReportEmailId] = useState<string>("");
    const [reportEmailPassword, setReportEmailPassword] = useState<string>("");
    const [emailLoginPassword, setEmailLoginPassword] = useState<string>("");
    const { data } = useGetEmailMaster();
    const { userDetail } = useContext(UserDetailContext);
    const { mutate, isSuccess, isError } = postDivisionTrackUser();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (isSuccess) {
            useSuccessNotification("Track user created successfully");
            queryClient.invalidateQueries({ queryKey: [division_login_track_user_key] });
            setAddTrackModalShow(false);
        } else if (isError) {
            useErrorNotification("Request failed!");
            setAddTrackModalShow(false);
        }
    }, [isSuccess, isError]);




    return (
        <div>
            <Formik
                initialValues={HirearchyTrackUserFormikInitialState}
                onSubmit={(values, action) => {
                    setTimeout(() => {
                        hirearchyTrackUserRef.current = {
                            name: values.name,
                            user_name: values.user_name,
                            mobile_no: values.mobile_no,
                            report_email_id: values.report_email_id = reportEmailId,
                            report_email_password: values.report_email_password = reportEmailPassword,
                            report_email_sent: values.report_email_sent === "true",
                            role: "TRACK_USER",
                            role_id: 7,
                            school_id: 1051,
                            device_list: ",",
                            track_division_id: "",
                            dept_id: 1,
                            email_login_password: emailLoginPassword,
                            path: "",
                            country_code: "IN",
                            is_railway_user: true,
                            po_end_date: "",
                            po_no: "",
                            last_modified: Math.floor(new Date().getTime() / 1000),
                            last_modified_by: userDetail.data.result.userName,
                            short_name: values.short_name,
                            whatsapp_group_name: values.whatsapp_group_name
                        }
                        if (hirearchyTrackUserRef.current != null) {
                            mutate(hirearchyTrackUserRef.current);
                            action.setSubmitting(false);
                        }

                    }, 500);

                }}
                // validationSchema={TrackUserValidation}
                onReset={() => {
                    setAddTrackModalShow(false);
                }}
            >
                {
                    ({ resetForm }: FormikProps<IHirearchyTrackUserFormikRequestInterface>) => (
                        <Form>
                            <div className="flex gap-4">
                                <CustomFormikInput
                                    label="Name"
                                    name="name"
                                    placeHolder="Enter Name"
                                    type="text"
                                />

                                <CustomFormikInput
                                    label="Username"
                                    name="user_name"
                                    placeHolder="Enter Username"
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-4 mt-2">
                                <CustomFormikInput
                                    label="Mobile Number"
                                    name="mobile_no"
                                    placeHolder="Enter Mobile Number"
                                    type="text"
                                />
                                <ReportEmailInput
                                    data={data?.data.data.result ?? []}
                                    setReportEmailId={setReportEmailId}
                                    setReportPassword={setReportEmailPassword}
                                    setEmailLoginPassword={setEmailLoginPassword}
                                />
                            </div>
                            <div className="flex gap-4 mt-2">
                                {/* <CustomFormikInput
                                    label="Report Email Password"
                                    name="report_email_password"
                                    placeHolder="Enter Report Email Password"
                                    type="password"
                                /> */}

                                <div>
                                    <h2 className="text-xs font-bold">
                                        Report Email Sent:
                                    </h2>
                                    <div className="flex mt-2 space-x-6">
                                        <CustomFormikRadioInput
                                            name="report_email_sent"
                                            label="True"
                                            value="true"
                                        />
                                        <CustomFormikRadioInput
                                            name="report_email_sent"
                                            label="False"
                                            value="false"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-3">
                                <CustomFormikInput
                                    label="Short Name"
                                    name="short_name"
                                    placeHolder="Enter Short Name"
                                    type="text"
                                />
                                <CustomFormikInput
                                    label="WhatsApp Group Name"
                                    name="whatsapp_group_name"
                                    placeHolder="Enter Whatsapp group Name"
                                    type="text"
                                />
                            </div>
                            <div className="flex mt-2 mb-2">
                                <Button type="button" name="Cancel" success={false} onHandleSubmit={resetForm} />
                                <Button type="submit" name="Submit" success={true} />
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}

export default AddTrackUserModal
