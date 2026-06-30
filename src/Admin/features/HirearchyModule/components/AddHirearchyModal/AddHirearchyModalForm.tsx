import { Field, Form, Formik, FormikProps } from "formik";
import { IHirearchyFormikCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { useContext, useEffect } from "react";
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext";
import CustomFormikInput from "../../../../../global/components/input/CustomInputBox/CustomFormikInput";
import departmentId from "../../data/departmentJSON.json";
import { useGetDivisionParentId } from "../../../../../api/queries/app/hooks/division-parent-id-api-hooks";
import { HirearchyFormModuleContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyFormModuleContext/HirearchyFormModuleContext";
import HirearchyStudentList from "../HirearchyStudentList/HirearchyStudentList";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";
import { Button } from "@chakra-ui/react";
import { PostCreateDivisionSubLogin } from "../../../../../api/queries/app/hooks/create-division-sublogin-api-hooks";
import { AddHirearchyValidation } from "../../hooks/AddHirearchyValidation";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";

const AddHirearchyModalForm = () => {
  const { hirearchyParentId, setHirearchyParentId } = useContext(
    HirearchyModuleParentContext
  );
  const { hirearchyStudentListRef, setHirearchyCreateResponse } = useContext(
    HirearchyFormModuleContext
  );
  const { studentDeviceDetail } = useContext(StudentDeviceDetailContext);
  const { setTableModalActive } = useContext(DataTableContext);

  const { mutate, isSuccess, data, isError } = PostCreateDivisionSubLogin();

  const { data: parentData } = useGetDivisionParentId(hirearchyParentId);

  useEffect(() => {
    if (isSuccess) {
      setHirearchyCreateResponse(data.data);
      setHirearchyParentId(data.data.data.result.track_division_id);
      setTableModalActive(false);
      useSuccessNotification("Hirearchy Added Successfully");
    }
  }, [isSuccess, data, isError]);

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          mobile_no: "",
          user_name: "",
          device_list: "",
          dept_id: "",
          path: "",
          path_name: "",
          track_division_id: hirearchyParentId,
          role: "RAIL_SUB_USER",
          role_id: "17",
          school_id: 0,
          country_code: null,
          is_railway_user: false,
          report_email_sent: false,
          email_login_password: null,
          po_end_date: "",
          po_no: "",
          short_name: "",
        }}
        onSubmit={(values, action) => {
          mutate({
            name: values.name,
            mobile_no: values.mobile_no,
            user_name: values.user_name,
            device_list: "," + hirearchyStudentListRef.current + ",",
            dept_id: parseInt(values.dept_id),
            path: values.path,
            track_division_id: values.track_division_id,
            role: values.role,
            role_id: parseInt(values.role_id),
            school_id: values.school_id,
            country_code: null,
            is_railway_user: values.is_railway_user,
            report_email_sent: values.report_email_sent,
            email_login_password: null,
            po_end_date: values.po_end_date,
            po_no: values.po_no,
            short_name: values.short_name,
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 700);
        }}
        validationSchema={AddHirearchyValidation}
      >
        {({
          values,
          setFieldValue,
        }: FormikProps<IHirearchyFormikCreateInterface>) => {
          useEffect(() => {
            if (values.dept_id) {
              const filteredData = parentData?.data.data.result.find(
                (parent) => parent.dept_id === parseInt(values.dept_id)
              );

              if (filteredData) {
                setFieldValue("path", `${filteredData.path}`);
                setFieldValue("school_id", filteredData.school_id);
                setFieldValue("is_railway_user", filteredData.is_railway_user);
                setFieldValue(
                  "report_email_sent",
                  filteredData.report_email_sent
                );
                setFieldValue("po_end_date", filteredData.po_end_date);
                setFieldValue("po_no", filteredData.po_no);
              }
            }
          }, [values.dept_id, setFieldValue]);

          return (
            <Form>
              <div>
                <div className="flex gap-2 w-full">
                  <CustomFormikInput
                    name="name"
                    id="name"
                    placeHolder="Enter name"
                  />
                  <CustomFormikInput
                    name="user_name"
                    id="user_name"
                    placeHolder="Enter email"
                  />
                </div>
                <div className="flex w-full gap-2">
                  <Field
                    as="select"
                    name="dept_id"
                    className="w-full border-2 outline-none border-gray-500 focus:border-black py-2 rounded"
                  >
                    <option value="">Select Designation</option>
                    {departmentId.map((item, index) => (
                      <option key={index} value={item.deptId}>
                        {item.name}
                      </option>
                    ))}
                  </Field>
                  <Field
                    as="select"
                    name="path_name"
                    className="w-full border-2 outline-none border-gray-500 focus:border-black py-2 rounded"
                  >
                    <option value="">Who is Parent</option>
                    {values.dept_id
                      ? parentData?.data.data.result
                          .filter(
                            (device) =>
                              device.dept_id < parseInt(values.dept_id)
                          )
                          .map((item, index) => (
                            <option key={index} value={item.user_name}>
                              {`${item.name} ${item.user_name}`}
                            </option>
                          ))
                      : ""}
                  </Field>
                </div>
                <div className="my-3 flex gap-2 w-full">
                  <CustomFormikInput
                    type="number"
                    name="mobile_no"
                    id="mobile_no"
                    placeHolder="Enter Mobile no"
                    className="w-full py-2 px-2 border-2 border-gray-400 focus:border-black"
                  />
                  <CustomFormikInput
                    type="text"
                    name="short_name"
                    id="short_name"
                    placeHolder="Enter short name"
                    className="w-full py-2 px-2 border-2 border-gray-400 focus:border-black"
                  />
                </div>
                <div className="w-full mt-2">
                  <HirearchyStudentList
                    data={studentDeviceDetail?.data.result}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" colorScheme="green">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    colorScheme="red"
                    onClick={() => {
                      setTableModalActive(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddHirearchyModalForm;
