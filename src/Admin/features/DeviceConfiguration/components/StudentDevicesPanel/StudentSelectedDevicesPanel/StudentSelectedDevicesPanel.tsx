import { ChangeEvent, useContext } from "react"
import { DeviceStudentSelectContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";
import StudentCss from "../../../styles/modules/StudentCss.module.css";


const StudentSelectedDevicesPanel = () => {

  const {filteredStudent,studentSelectedDevices,setFilteredStudent,setStudentSelectedDevices} = useContext(DeviceStudentSelectContext);


  const handleChangeCheckedDevice = (e: ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault();
    const {checked,name} = e.target;
    const updateStudent = filteredStudent.map((student)=> student.deviceId == name ? {...student, isChecked:checked} : student );
    setFilteredStudent(updateStudent);
    if(checked == false)
    {
      const deletedId = filteredStudent.find(student => student.deviceId == name)?.imeiNo;
      const updatedStudentDevices = studentSelectedDevices.flat().filter((student) => student.device_imei !== deletedId);
      setStudentSelectedDevices(updatedStudentDevices);
    }
  
  }


  const onHandleDevices = (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    setStudentSelectedDevices([]);
    const updateStudent = filteredStudent.map((student) => ({
      ...student,
      isChecked:false
    }));
    setFilteredStudent(updateStudent);
  }




  return (
    <div className="w-full px-4 py-2 mb-2 bg-gray-300 rounded">
        <div className="flex items-center justify-between pr-4 mb-2">
          <div>
          <h2 className="text-xs font-semibold text-dark">
                Selected Devices:
            </h2>
          </div>
          <div className="flex items-center space-x-6">
          <h3 className="font-semibold text-black text-xss">
              Device Count: {filteredStudent.filter((student)=>student.isChecked).length}
            </h3>
            <button 
            onClick={onHandleDevices} 
            className="flex ripple bg-theme-darkBlue text-gray-200 items-center px-3 py-0.5 rounded space-x-2 text-xs font-semibold border-2 border-gray-400 cursor-pointer">
              clear
            </button>
          </div>

        </div>
        <div className={`w-full px-2 py-2 flex gap-3 flex-wrap text-justify overflow-hidden border-2 border-gray-700 rounded max-h-32 ${StudentCss.studentContainer}`}>
            {
              filteredStudent.filter((student)=> student.isChecked).map((item,index)=>(
                <div key={index} className="flex items-center gap-1">
                  <input
                  type="checkbox"
                  id={item.deviceId}
                  className="cursor-pointer"
                  name={item.deviceId}
                  checked={item.isChecked}
                  onChange={handleChangeCheckedDevice}
                  />
                  <span className="font-bold text-black">
                    {item.deviceNo}
                  </span>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default StudentSelectedDevicesPanel
