import React, { useEffect, useState } from "react";
import { useGetStudentDeviceDetailQuery } from "../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { IStudentDevice } from "../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceInterface";





interface InspectionDeviceInterface{
    parentId: string;
    onDeviceSelect:(student:IStudentDevice,index:number) => void,
    indexNo:number,
    deviceName?:string;
}




const InspectionDeviceSearch: React.FC<InspectionDeviceInterface> = ({parentId,onDeviceSelect,indexNo,deviceName}) =>{
    const {data,isSuccess} = useGetStudentDeviceDetailQuery(parentId);
    const [query,setQuery] = useState<string>(deviceName ? deviceName : "");
    const [showDropdown,setShowDropdown] = useState<boolean>(false);
    const [studentList,setStudentList] = useState<IStudentDevice[]>([]);


    useEffect(()=>{
        if(isSuccess){
            setStudentList(data.data.data.result);
        }
    },[isSuccess,data]);

    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setQuery(e.target.value);
        setShowDropdown(true);
    }

    const filteredStudentList = studentList?.filter((p)=>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.deviceNo.toString().toLowerCase().includes(query.toLowerCase()) ||
        p.imeiNo.toString().toLowerCase().includes(query)
    );

    const handleSelectPatient = (student:IStudentDevice) =>{
        setShowDropdown(false);
        setQuery(student.name);
        onDeviceSelect(student,indexNo);
    }


    return (
        <div className="w-full">
            <div className=" items-center">
                <div className="relative flex items-center gap-4">
                    <input
                        type="search"
                        id="appointment_search"
                        name="appointment_search"
                        placeholder="Search existing Devices by name or imeino"
                        value={query}
                        autoComplete="off"
                        onChange={(e) => handleSearch(e)}
                        className="w-full px-3 py-1 placeholder:text-xs text-sm border rounded-lg outline-none"
                    />

                    {showDropdown && query && (
                        <div
                            tabIndex={0}
                            className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-md z-10 max-h-60 overflow-y-auto"
                        >
                            {filteredStudentList?.length > 0 ? (
                                filteredStudentList.map((student) => (
                                    <div
                                        key={student.imeiNo}
                                        className={`px-3 py-2 cursor-pointer border-b-2 border-gray-800`}
                                        onClick={() => handleSelectPatient(student)}
                                    >
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-sm text-slate-500">
                                            Imei: {student.imeiNo} | No: {student.deviceNo}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-slate-500">
                                    No Students Found                                    
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
export default InspectionDeviceSearch;