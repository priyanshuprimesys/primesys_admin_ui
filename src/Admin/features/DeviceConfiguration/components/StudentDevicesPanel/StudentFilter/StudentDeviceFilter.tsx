import { useContext } from "react";
import { DeviceStudentSelectContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";
import { DeviceTypeContext } from "../../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";




interface StudentDeviceProps {
    setSelectedOption: (option: string) => void;
}




const StudentDeviceFilter: React.FC<StudentDeviceProps> = ({ setSelectedOption }) => {

    const { studentTypeId } = useContext(DeviceStudentSelectContext);
    const { deviceType } = useContext(DeviceTypeContext);


    return (
        <>
            <select id="countries"
                onChange={(e) => setSelectedOption(e.target.value)}
                value={studentTypeId}
                className="block p-2 text-xs text-gray-900 border-2 rounded-lg outline-none bg-gray-50 border-dark max-w-60">
                <option value="0">Select Role</option>
                {
                    deviceType?.data.result?.map((val, index) => (
                        <option key={index} value={val.deviceTypeId}>
                            {val.deviceType}
                        </option>
                    ))
                }
            </select>
        </>
    )
}



export default StudentDeviceFilter;