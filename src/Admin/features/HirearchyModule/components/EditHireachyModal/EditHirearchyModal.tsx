import { useContext, useEffect, useState } from "react";
import { IDivisionParentIdInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface";
import { InputValueBox } from "../../../../../global/components/input/InputValueBox";
import SelectInputValueBox from "../../../../../global/components/input/SelectInput/SelectInputValueBox";
import StaticCssButton from "../../../../../global/components/button/StaticCssButton";
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext";
import EditHirearchyStudentList from "./EditHirearchyStudentList";
import { isValidPhoneNumber, validateEmail } from "../../hooks/FormValidation";
import validPathString from "../../hooks/validPathString";
import UpdateDeviceSelectedList from "./UpdateDeviceSelectedList";
import { HirearchyModuleUpdateContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleUpdateContext/HirearchyModuleUpdateContext";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { postUpdateDivisionSubLogin } from "../../../../../api/queries/app/hooks/update-division-sublogin-api";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { Select, Switch } from '@chakra-ui/react'
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import ReportEmailInput from "../TrackUser/ReportEmailInput/ReportEmailInput";
import { useGetEmailMaster } from "../../services/hooks";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

interface EditHirearchyProps {
  editData: IDivisionParentIdInterface[];
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  parent?: string;
}

const inputCss =
  "w-full px-3 py-2 border-2 border-gray-300 rounded-lg outline-none placeholder:text-xss focus:border-gray-800 transition-colors";

/* ── reusable section wrapper ────────────────────────────────────────────── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-200 overflow-hidden mb-3">
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1 mt-1 px-1 text-[11px] font-medium text-red-600">
      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      {message}
    </p>
  ) : null;

const EditHirearchyModal: React.FC<EditHirearchyProps> = ({ editData, onClose }) => {

  const { deviceType } = useContext(DeviceTypeContext);
  const { setHirearchyDeviceType } = useContext(StudentDeviceDetailContext);
  const [reportEmailId, setReportEmailId] = useState<string>(editData[0].report_email_id);
  const [reportEmailPassword, setReportEmailPassword] = useState<string>("");
  const { data: reportEmail } = useGetEmailMaster();
  const [hierarchyName, setHirearchyName] = useState<string>(editData[0].name);
  const [activeStatus, setActiveStatus] = useState<boolean>(editData[0].active_status);
  const [emailLoginPassword, setEmailLoginPassword] = useState<string>("");
  const [hirearchyEmail, setHirearchyEmail] = useState<string>(editData[0].user_name);
  const [hirearchyMobile, setHirearchyMobile] = useState<string>(editData[0].mobile_no);
  const [hirearchyShortName, setHirearchyShortName] = useState<string>(editData[0]?.short_name);
  const [hirearchyDepartmentId, setHirearchyDeparmentId] = useState<string>(editData[0].dept_id.toString());
  const [whatsappGroupName, setWhatsAppGroupName] = useState<string>(editData[0].whatsapp_group_name);
  const [errors, setErrors] = useState<FormErrors>({});

  const { hirearchyParentDetailData } = useContext(HirearchyModuleParentContext);
  const { updateDeviceListRef, updateHirearchyDeviceRef } = useContext(HirearchyModuleUpdateContext);
  const [clearSelectedDevice, setClearSelectedDevice] = useState<boolean>(false);
  const { userDetail } = useContext(UserDetailContext);

  const { mutate, isPending, isSuccess, data } = postUpdateDivisionSubLogin();

  const pathString = validPathString(editData[0].path, editData[0].id);

  const hirearchyParentData = hirearchyParentDetailData.data.result.filter(
    (item) => item.path == pathString + ","
  );

  const hirearchyParentListData = hirearchyDepartmentId
    ? hirearchyParentDetailData.data.result.filter(
      (device) => device.dept_id < parseInt(hirearchyDepartmentId)
    )
    : hirearchyParentData;

  const [hirearchyDepartmentParentId, setHirearchyDepartmentParentId] =
    useState<string>(editData[0].path);

  useEffect(() => {
    if (validateEmail(hirearchyDepartmentParentId)) {
      const hirearchyParentPath = hirearchyParentDetailData.data.result.filter(
        (item) => item.user_name == hirearchyDepartmentParentId
      );
      setHirearchyDepartmentParentId(
        hirearchyParentPath[0]?.path + editData[0].id + ","
      );
    }
  }, [hirearchyDepartmentParentId]);

  useEffect(() => {
    setHirearchyDeviceType("");
  }, []);

  const departmentId = [
    { id: 1, name: "DEN", deptId: 2 },
    { id: 2, name: "ADEN", deptId: 3 },
    { id: 3, name: "PWAY", deptId: 4 },
    { id: 4, name: "Jr PWAY", deptId: 5 },
  ];

  const onCancelHirearchy = () => {
    onClose();
    setClearSelectedDevice(false);
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!hierarchyName.trim())                  next.name   = "Name is required";
    if (!hirearchyEmail.trim())                 next.email  = "Email is required";
    else if (!validateEmail(hirearchyEmail))    next.email  = "Enter a valid email address";
    if (!hirearchyMobile.trim())                next.mobile = "Mobile number is required";
    else if (!isValidPhoneNumber(hirearchyMobile)) next.mobile = "Enter a valid mobile number";
    if (!hirearchyDepartmentParentId)           next.parent = "Select a parent department";
    return next;
  };

  const onUpdateHirearchy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isPending) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    updateHirearchyDeviceRef.current = {
      ...updateHirearchyDeviceRef.current,
      id: editData[0].id,
      name: hierarchyName,
      user_name: hirearchyEmail,
      school_id: editData[0].school_id,
      mobile_no: hirearchyMobile,
      role_id: editData[0].role_id,
      dept_id: parseInt(hirearchyDepartmentId),
      is_railway_user: true,
      path: hirearchyDepartmentParentId,
      device_list: "," + updateDeviceListRef.current + ",",
      po_no: editData[0].po_no ?? "",
      po_end_date: editData[0].po_end_date ?? "",
      track_division_id: editData[0].track_division_id,
      role: editData[0].role,
      report_email_sent: editData[0].report_email_sent,
      last_modified_by: userDetail.data.result.userName,
      last_modified: new Date().getTime() / 1000,
      short_name: hirearchyShortName,
      active_status: activeStatus,
      whatsapp_group_name: whatsappGroupName,
      report_email_id: reportEmailId,
      report_email_password: reportEmailPassword,
      email_login_password: emailLoginPassword,
    };

    mutate(updateHirearchyDeviceRef.current);
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      useSuccessNotification("Updated Successfully");
    }
  }, [isSuccess, data]);

  const handleActiveStatus = () => setActiveStatus((prev) => !prev);

  return (
    <div className="space-y-1">

      {/* ── Basic Information ── */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputValueBox
              labelName="Name"
              defaultValue={editData[0].name}
              placeHolder="Enter name"
              className={inputCss}
              fieldName="name"
              setInputState={(v) => { setHirearchyName(v); setErrors((e) => ({ ...e, name: undefined })); }}
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <InputValueBox
              labelName="Email"
              defaultValue={editData[0].user_name}
              placeHolder="Enter email"
              className={inputCss}
              fieldName="email"
              setInputState={(v) => { setHirearchyEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            />
            <FieldError message={errors.email} />
          </div>
          <div>
            <InputValueBox
              labelName="Mobile Number"
              defaultValue={editData[0].mobile_no}
              placeHolder="Enter mobile number"
              className={inputCss}
              fieldName="mobile_no"
              setInputState={(v) => { setHirearchyMobile(v); setErrors((e) => ({ ...e, mobile: undefined })); }}
            />
            <FieldError message={errors.mobile} />
          </div>
          <div>
            <InputValueBox
              labelName="Short Name"
              defaultValue={editData[0].short_name}
              placeHolder="Enter short name"
              className={inputCss}
              fieldName="short_name"
              setInputState={setHirearchyShortName}
            />
          </div>
        </div>
      </Section>

      {/* ── Department & Status ── */}
      <Section title="Department & Status">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <SelectInputValueBox
              labelName="Department"
              selectOption={departmentId}
              selectName="name"
              selectValue="deptId"
              setSelectValue={setHirearchyDeparmentId}
              defaultValue={editData[0].dept_id}
            />
          </div>
          <div>
            <SelectInputValueBox
              labelName="Parent Department"
              selectOption={hirearchyParentListData}
              selectName="name"
              selectValue="user_name"
              selectOptionBracket="user_name"
              setSelectValue={(v: string) => { setHirearchyDepartmentParentId(v); setErrors((e) => ({ ...e, parent: undefined })); }}
              defaultValue={hirearchyParentData[0]?.user_name}
            />
            <FieldError message={errors.parent} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3 items-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Active Status</span>
            <Switch id="isChecked" isChecked={activeStatus} onChange={handleActiveStatus} colorScheme="green" />
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activeStatus ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
              {activeStatus ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <InputValueBox
              labelName="WhatsApp Group Name"
              defaultValue={editData[0].whatsapp_group_name}
              placeHolder="Enter WhatsApp group name"
              className={inputCss}
              fieldName="whatsapp_group_name"
              setInputState={setWhatsAppGroupName}
            />
          </div>
        </div>
      </Section>

      {/* ── Reporting ── */}
      <Section title="Reporting">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="px-1 text-sm font-semibold text-gray-700">Student Type</label>
            <Select mt={1} onChange={(e) => setHirearchyDeviceType(e.target.value)} placeholder="Select option">
              {deviceType?.data.result.map((item, index) => (
                <option key={index} value={item.deviceTypeId}>{item.deviceType}</option>
              ))}
            </Select>
          </div>
          {editData[0].dept_id == 1 && (
            <div>
              <ReportEmailInput
                data={reportEmail?.data.data.result ?? []}
                setReportEmailId={setReportEmailId}
                setReportPassword={setReportEmailPassword}
                setEmailLoginPassword={setEmailLoginPassword}
                reportEmailId={reportEmailId}
              />
            </div>
          )}
        </div>
      </Section>

      {/* ── Device Assignment ── */}
      <Section title="Device Assignment">
        <div className="mb-2">
          <UpdateDeviceSelectedList setClearSelectedDevice={setClearSelectedDevice} />
        </div>
        <EditHirearchyStudentList clearSelectedDevice={clearSelectedDevice} deviceList={editData[0].device_list} />
      </Section>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-1">
        <StaticCssButton
          name="Cancel"
          onHandleButtonClick={onCancelHirearchy}
          padding="py-2 px-2"
          width="w-full"
          success={false}
          disabled={isPending}
        />
        <button
          type="button"
          onClick={onUpdateHirearchy}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-[#075E54] text-white font-semibold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating…
            </>
          ) : "Update"}
        </button>
      </div>
    </div>
  );
};

export default EditHirearchyModal;
