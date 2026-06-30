import { useContext, useEffect } from "react";
import SelectInput from "../SelectInput/SelectInput";
import HirearchyStudentList from "../HirearchyStudentList/HirearchyStudentList";
import { HirearchyModuleParentContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext";
import { useGetDivisionParentId } from "../../../../../api/queries/app/hooks/division-parent-id-api-hooks";
import StaticCssButton from "../../../../../global/components/button/StaticCssButton";
import { IDivisionParentIdInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface";
import { HirearchyFormModuleContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyFormModuleContext/HirearchyFormModuleContext";
import { HirearchyCreateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyCreateInitialStates/HirearchyCreateInitialState";
import { PostCreateDivisionSubLogin } from "../../../../../api/queries/app/hooks/create-division-sublogin-api-hooks";
import GlobalInputRef from "../../../../../global/components/input/GlobalInputRef";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { isValidPhoneNumber, validateEmail } from "../../hooks/FormValidation";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";

const AddHirearchyModal = () => {
  const { hirearchyParentId, setHirearchyParentId } = useContext(
    HirearchyModuleParentContext
  );
  const {
    hirearchyNameRef,
    hirearchyEmailRef,
    hirearchyShortNameRef,
    hireachyMobileNumberRef,
    hirearchyDeparmentId,
    setHirearchyDeparmentId,
    hirearchyDepartmentParentId,
    setHirearchyDepartmentParentId,
    hirearchyStudentListRef,
    hirearchyCreateFormRef,
    setHirearchyCreateResponse,
  } = useContext(HirearchyFormModuleContext);

  const { setTableModalActive } = useContext(DataTableContext);

  const { data: parentData } = useGetDivisionParentId(hirearchyParentId);
  const { studentDeviceDetail } = useContext(StudentDeviceDetailContext);

  const { mutate, isSuccess, data, isError, error } =
    PostCreateDivisionSubLogin();

  const hirearchyDetail: IDivisionParentIdInterface[] = parentData
    ? parentData.data.data.result.filter(
        (parent) => parent.user_name == hirearchyDepartmentParentId
      )
    : [];
  const hirearchyParentDetailList =
    parentData && hirearchyDeparmentId
      ? parentData.data.data.result.filter(
          (device) => device.dept_id < parseInt(hirearchyDeparmentId)
        )
      : [];

  const departmentId = [
    {
      id: 1,
      name: "DEN",
      deptId: 2,
    },
    {
      id: 2,
      name: "ADEN",
      deptId: 3,
    },
    {
      id: 3,
      name: "PWAY",
      deptId: 4,
    },
    {
      id: 4,
      name: "Jr PWAY",
      deptId: 5,
    },
  ];

  const onSaveHirearchy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (
      hirearchyDeparmentId == "" ||
      hirearchyDepartmentParentId == "" ||
      hirearchyNameRef.current?.value == "" ||
      hirearchyEmailRef.current?.value == "" ||
      hireachyMobileNumberRef.current?.value == ""
    ) {
      alert("Please do not leave any field empty");
      return;
    } else {
      const mobile = isValidPhoneNumber(hireachyMobileNumberRef.current?.value);
      const email = validateEmail(hirearchyEmailRef.current?.value);

      if (!email) {
        alert("Please enter a valid email id");
        return;
      }
      if (!mobile) {
        alert("Enter a valid mobile number");
        return;
      }

      if (hirearchyDetail.length == 0) {
        alert("Please select Department Parent Id");
        return;
      } else {
        hirearchyCreateFormRef.current = {
          ...hirearchyCreateFormRef.current,
          name: hirearchyNameRef.current?.value ?? "",
          user_name: hirearchyEmailRef.current?.value ?? "",
          mobile_no: hireachyMobileNumberRef.current?.value ?? "",
          dept_id: parseInt(hirearchyDeparmentId),
          device_list: "," + hirearchyStudentListRef.current + ",",
          path: hirearchyDetail[0]?.path,
          role_id: 17,
          role: "RAIL_SUB_USER",
          school_id: hirearchyDetail[0].school_id,
          country_code: null,
          is_railway_user: hirearchyDetail[0].is_railway_user,
          report_email_sent: hirearchyDetail[0].report_email_sent,
          email_login_password: null,
          po_end_date: hirearchyDetail[0].po_end_date,
          po_no: hirearchyDetail[0].po_no,
          track_division_id: hirearchyParentId,
          short_name: hirearchyShortNameRef.current?.value ?? "",
        };
      }
    }

    if (hirearchyCreateFormRef.current.user_name != "") {
      mutate(hirearchyCreateFormRef.current);
      hirearchyStudentListRef.current = "";
    }
  };

  const onCancelHirearchy = () => {
    hirearchyCreateFormRef.current = HirearchyCreateInitialState;
    hirearchyStudentListRef.current = "";
    setTableModalActive(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setHirearchyCreateResponse(data.data);
      setHirearchyParentId(data.data.data.result.track_division_id);
      setTableModalActive(false);
      useSuccessNotification("Hirearchy Added Successfully");
    }
  }, [isSuccess, data, isError]);

  return (
    <div className="overflow-hidden ">
      <div className="flex justify-between w-full gap-4">
        <GlobalInputRef
          type="text"
          inputRef={hirearchyNameRef}
          placeHolder="Enter Name"
          className="w-64 px-2 py-2 border-2 border-gray-400 rounded outline-none placeholder:text-xss focus:border-gray-800"
        />
        <GlobalInputRef
          errorMessage={error?.message}
          type="text"
          inputRef={hirearchyEmailRef}
          placeHolder="Enter Email"
          className="w-64 px-2 py-2 border-2 border-gray-400 rounded outline-none placeholder:text-xss focus:border-gray-800"
        />
      </div>
      <div className="flex justify-between">
        <div className="w-64">
          <SelectInput
            defaultOptionName="Select Designation"
            selectOption={departmentId}
            selectName="name"
            selectValue="deptId"
            setSelectValue={setHirearchyDeparmentId}
          />
        </div>
        <div className="w-64">
          <SelectInput
            defaultOptionName="Who is parent"
            selectOption={hirearchyParentDetailList}
            setSelectValue={setHirearchyDepartmentParentId}
            selectName="name"
            selectOptionBracket="user_name"
            selectValue="user_name"
          />
        </div>
      </div>
      <div className="flex justify-between w-full gap-2">
        <GlobalInputRef
          type="number"
          inputRef={hireachyMobileNumberRef}
          placeHolder="Enter Mobile Number"
          className="w-64 px-2 py-2 border-2 border-gray-400 rounded outline-none placeholder:text-xss focus:border-gray-800"
        />
        <GlobalInputRef
          type="text"
          inputRef={hirearchyShortNameRef}
          placeHolder="Enter Short Name"
          className="w-64 px-2 py-2 border-2 border-gray-400 rounded outline-none placeholder:text-xss focus:border-gray-800"
        />
      </div>

      <div className="w-full mt-2">
        <HirearchyStudentList data={studentDeviceDetail?.data?.result} />
      </div>
      <div className="flex gap-4">
        <StaticCssButton
          name="Cancel"
          onHandleButtonClick={onCancelHirearchy}
          padding="py-2 px-2"
          width="w-full"
          success={false}
          disabled={false}
        />
        <StaticCssButton
          name="Save"
          onHandleButtonClick={onSaveHirearchy}
          padding="py-2 px-2"
          width="w-full"
          success={true}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default AddHirearchyModal;
