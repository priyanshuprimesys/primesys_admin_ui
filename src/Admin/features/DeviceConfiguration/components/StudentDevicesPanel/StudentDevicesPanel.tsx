import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import StudentCss from "../../styles/modules/StudentCss.module.css";
import StudentDeviceFilter from "./StudentFilter/StudentDeviceFilter";
import StudentSelectDeselect from "./StudentSelectDeSelect/StudentSelectDeselect";
import { DeviceStudentSelectContext } from "../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { DeviceCommandContext } from "../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { DivisionParentIdContext } from "../../../../../contexts/AppLayout/Admin/DivisionParentIdContext/DivisionParentIdContext";
import StudentSelectedDevicesPanel from "./StudentSelectedDevicesPanel/StudentSelectedDevicesPanel";
import { toast } from "react-toastify";
// import StudentRangeFilter from "./StudentRangeFilter/StudentRangeFilter";

const StudentDevicesPanel = () => {
  const { studentDeviceDetail, studentDeviceLoading } = useContext(
    StudentDeviceDetailContext
  );

  const [commaDevices, setCommaDevices] = useState<string>("")

  const {
    setStudentSelectedDevices,
    studentSelectedDevices,
    selectAllStudent,
    setSelectAllStudent,
    setStudentActive,
    studentActive,
    studentTypeId,
    setStudentTypeId,
    filteredStudent,
    setFilteredStudent,
  } = useContext(DeviceStudentSelectContext);
  const { userDetail } = useContext(UserDetailContext);
  const {
    deviceCommand,
    periodCommandBool,
    endTimeOne,
    endTimeTwo,
    startTimeOne,
    startTimeTwo,
  } = useContext(DeviceCommandContext);
  const { parentDivisionId } = useContext(DivisionParentIdContext);

  const updateStudentId = useCallback(() => {
    const filterStudentResult =
      studentActive === "on" && parseInt(studentTypeId) > 0
        ? studentDeviceDetail.data.result.filter(
          (x) =>
            x.isDeviceConnected == true &&
            x.deviceTypeId == parseInt(studentTypeId)
        )
        : studentActive === "on" && parseInt(studentTypeId) == 0
          ? studentDeviceDetail.data.result.filter(
            (x) => x.isDeviceConnected == true
          )
          : studentActive === "off" && parseInt(studentTypeId) > 0
            ? studentDeviceDetail.data.result.filter(
              (x) =>
                x.deviceTypeId == parseInt(studentTypeId) &&
                x.isDeviceConnected == false
            )
            : studentActive === "off" && parseInt(studentTypeId) == 0
              ? studentDeviceDetail.data.result.filter(
                (x) => x.isDeviceConnected == false
              )
              : studentActive === "all" && parseInt(studentTypeId) > 0
                ? studentDeviceDetail.data.result.filter(
                  (x) => x.deviceTypeId == parseInt(studentTypeId)
                )
                : studentDeviceDetail.data.result;

    const initialFilteredStudent = filterStudentResult.map((student) => ({
      ...student,
      isChecked: false,
    }));
    setFilteredStudent(initialFilteredStudent);
    setStudentSelectedDevices([]);
  }, [studentActive, studentTypeId, studentDeviceDetail]);

  useEffect(() => {
    updateStudentId();
  }, [studentDeviceDetail]);

  useEffect(() => {
    if (studentActive || studentTypeId) {
      updateStudentId();
      setSelectAllStudent(false);
    }
  }, [studentActive, studentTypeId]);

  // useEffect(()=>{
  //     if(!selectAllStudent)
  //     {
  //         const initialFilterResult = filteredStudent.map(student =>({
  //             ...student,
  //             isChecked:false
  //         }));
  //         setFilteredStudent(initialFilterResult);
  //     }
  // },[selectAllStudent]);

  // useEffect(()=>{
  //     if(studentSelectedDevices.length == 0)
  //     {
  //         const initialFilterResult = filteredStudent.map(student =>({
  //             ...student,
  //             isChecked:false
  //         }));
  //         setFilteredStudent(initialFilterResult);
  //     }
  // },[studentSelectedDevices]);

  const handleStudentChecked = (e: ChangeEvent<HTMLInputElement>) => {
    // alert("Hello");
    const { checked, name } = e.target;
    const updatedstudents = filteredStudent.map((user) =>
      user.deviceId == name ? { ...user, isChecked: checked } : user
    );
    let selectedIds: any[] = [...studentSelectedDevices];
    setFilteredStudent(updatedstudents);

    if (periodCommandBool) {
      if (checked) {
        const selectedStudent = updatedstudents.filter(
          (student) => student.isChecked && student.deviceId == name
        );
        let periodCommandStudent: any[] = [];
        let periodStudent;
        for (let i = 0; i < 3; i++) {
          selectedStudent.forEach((student) => {
            periodStudent = {
              device_imei: student.imeiNo,
              command:
                startTimeTwo != ""
                  ? `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo}`
                  : `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne}`,
              device_name: student.name,
              login_name: userDetail.data.result.userName,
              division_id: parentDivisionId,
            };
          });
          periodCommandStudent.push(periodStudent);
        }

        selectedIds.push(periodCommandStudent);
      }
      if (checked == false) {
        const deselectedStudent = updatedstudents.filter(
          (student) => !student.isChecked && student.deviceId == name
        );
        const deletedImei = deselectedStudent[0].imeiNo;
        selectedIds = selectedIds
          .flat()
          .filter((student) => student.device_imei != deletedImei);
      }
    } else {
      selectedIds = updatedstudents
        .filter((student) => student.isChecked)
        .map((student) => ({
          device_imei: student.imeiNo,
          command: deviceCommand,
          device_name: student.name,
          login_name: userDetail.data.result.userName,
          division_id: parentDivisionId,
        }));
    }

    setStudentSelectedDevices(selectedIds);
  };

  const onSelectAllStudent = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setSelectAllStudent(checked);
    let updatedIds: any[] = [];

    if (periodCommandBool) {
      const updatedStudentIds = filteredStudent.map((student) => ({
        ...student,
        isChecked: checked,
      }));
      const filterUpdatedIds = updatedStudentIds.filter(
        (student) => student.isChecked
      );

      let seniorArray: any[] = [];
      let juniorArray: any[] = [];
      let periodStudent;

      for (let i = 0; i < filterUpdatedIds.length; i++) {
        juniorArray = [];
        for (let j = 0; j < 3; j++) {
          periodStudent = {
            device_imei: filterUpdatedIds[i].imeiNo,
            command:
              startTimeTwo != ""
                ? `PERIOD,1,1,${j},${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo}`
                : `PERIOD,1,1,${j},${startTimeOne}-${endTimeOne}`,
            device_name: filterUpdatedIds[i].name,
            login_name: userDetail.data.result.userName,
            division_id: parentDivisionId,
          };
          juniorArray.push(periodStudent);
        }
        seniorArray.push(juniorArray);
      }
      setFilteredStudent(updatedStudentIds);
      updatedIds.push(seniorArray);
    } else {
      const updatedStudents = filteredStudent.map((student) => ({
        ...student,
        isChecked: checked,
      }));

      updatedIds = updatedStudents
        .filter((student) => student.isChecked)
        .map((student) => ({
          device_imei: student.imeiNo,
          command: deviceCommand,
          device_name: student.name,
          login_name: userDetail.data.result.userName,
          division_id: parentDivisionId,
        }));
      setFilteredStudent(updatedStudents);
    }

    setStudentSelectedDevices(updatedIds.flat());
  };

  const onSelectActiveStudent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setStudentActive(value);
  };

  const onhandleSelectDevice = () => {
    if (filteredStudent.length == 0) {
      return toast.error("No students available.");
    }
    const devices: number[] = Array.from(new Set(commaDevices.split(",").map(Number).filter((dev) => !isNaN(dev) && dev != 0)));
    console.log("Devices:", devices);

    const updateDevices = filteredStudent.map(user =>
      devices.includes(user.deviceNo)
        ? { ...user, isChecked: true }
        : user
    );
    setFilteredStudent(updateDevices);

    let selectedIds: any[] = [...studentSelectedDevices];

    console.log("period command bool:", periodCommandBool);

    if (periodCommandBool) {
      const selectedStudent = updateDevices.filter(
        (student) => student.isChecked
      );

      let periodCommandStudent: any[] = [];

      for (let i = 0; i < 3; i++) {
        selectedStudent.forEach((student) => {
          periodCommandStudent.push({
            device_imei: student.imeiNo,
            command:
              startTimeTwo !== ""
                ? `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne},${startTimeTwo}-${endTimeTwo}`
                : `PERIOD,1,1,${i},${startTimeOne}-${endTimeOne}`,
            device_name: student.name,
            login_name: userDetail.data.result.userName,
            division_id: parentDivisionId,
          });
        });
      }
      selectedIds.push(...periodCommandStudent);
    }
    else {
      selectedIds = updateDevices
        .filter((student) => student.isChecked)
        .map((student) => ({
          device_imei: student.imeiNo,
          command: deviceCommand,
          device_name: student.name,
          login_name: userDetail.data.result.userName,
          division_id: parentDivisionId,
        }));
    }

    setStudentSelectedDevices(selectedIds);
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-blackShadow">
      {/* Toolbar */}
      <div className="bg-dark px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <StudentDeviceFilter setSelectedOption={setStudentTypeId} />

            {/* ON / OFF / ALL pill toggle */}
            <div className="flex items-center bg-gray-800 rounded-lg p-0.5 gap-0.5">
              <label
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                  studentActive === "on"
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <input type="radio" name="studentFilter" value="on" checked={studentActive === "on"} onChange={onSelectActiveStudent} className="sr-only" />
                ON
              </label>
              <label
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                  studentActive === "off"
                    ? "bg-red-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <input type="radio" name="studentFilter" value="off" checked={studentActive === "off"} onChange={onSelectActiveStudent} className="sr-only" />
                OFF
              </label>
              <label
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                  studentActive === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <input type="radio" name="studentFilter" value="all" checked={studentActive === "all"} onChange={onSelectActiveStudent} className="sr-only" />
                ALL
              </label>
            </div>

            {/* Select All */}
            <StudentSelectDeselect selected={selectAllStudent} onSelectStudent={onSelectAllStudent} />

            {/* Device number input */}
            <div className="flex gap-2 items-center">
              <input
                className="rounded-lg outline-none min-w-[280px] py-1.5 px-3 text-xs bg-gray-800 text-white border border-gray-600 placeholder-gray-500 focus:border-primary transition-colors"
                value={commaDevices}
                onChange={(e) => setCommaDevices(e.target.value)}
                placeholder="Select devices: 1,2,3,4,5"
              />
              <button
                type="button"
                onClick={onhandleSelectDevice}
                className="py-1.5 text-xs font-semibold cursor-pointer px-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Select
              </button>
            </div>
          </div>

          {/* Device Count Badge */}
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-gray-400">Devices:</span>
            <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">
              {filteredStudent.length > 1 ? filteredStudent.length : 0}
            </span>
          </div>
        </div>
      </div>

      {filteredStudent.filter((student) => student.isChecked).length > 0 &&
        !selectAllStudent && <StudentSelectedDevicesPanel />}

      {/* Device Grid */}
      <div
        className={`w-full px-4 py-3 flex gap-2 flex-wrap bg-gray-100 overflow-hidden max-h-60 border-t border-gray-200 ${StudentCss.studentContainer}`}
      >
        {studentDeviceLoading ? (
          <div className="w-full flex items-center justify-center py-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="m-0 text-xs font-medium text-gray-500">Loading devices...</p>
            </div>
          </div>
        ) : studentDeviceDetail.data.result.length > 0 ? (
          filteredStudent.length > 0 ? (
            filteredStudent.map((item, index) => (
              <label
                key={index}
                htmlFor={item.deviceId}
                className={`flex gap-1.5 items-center px-2 py-1 rounded-lg cursor-pointer select-none transition-all shadow-sm
                  ${item.isChecked ? "ring-2 ring-primary bg-blue-50" : "bg-white hover:bg-gray-50"}
                  border ${
                    item.validDay > 0
                      ? item.isDeviceConnected
                        ? "border-green-400"
                        : "border-red-400"
                      : "border-gray-300"
                  }`}
              >
                <input
                  type="checkbox"
                  disabled={deviceCommand === ""}
                  id={item.deviceId}
                  className="cursor-pointer w-3 h-3 accent-primary"
                  name={item.deviceId}
                  checked={item.isChecked}
                  onChange={handleStudentChecked}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item.validDay > 0
                      ? item.isDeviceConnected
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    item.validDay > 0
                      ? item.isDeviceConnected
                        ? "text-green-700"
                        : "text-red-700"
                      : "text-gray-600"
                  }`}
                >
                  {item.deviceNo}
                </span>
              </label>
            ))
          ) : (
            <p className="w-full text-center text-xs font-medium text-gray-500 py-8">No Device Found</p>
          )
        ) : (
          <p className="w-full text-center text-xs font-medium text-gray-500 py-8">
            Please Select Parent Id...
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentDevicesPanel;
