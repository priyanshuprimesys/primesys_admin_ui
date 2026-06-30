import { Button, CircularProgress } from "@chakra-ui/react";
import { useGetStudentDeviceDetailQuery } from "../../../../../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { DeviceTypeContext } from "../../../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";


interface StudentDeviceInterface {
    divisionId: string,
    deviceTypeID: string,
    setStudentDevices: (text: string) => void,
    studentDevices: string,
}

interface DeviceInterface {
    deviceId: string;
    validDay: number;
    name: string;
    imeiNo: number;
    showGoogleAddress: boolean;
    simNo: string;
    studentId: number;
    deviceTypeId: number;
    deviceUsertype: string;
    isDeviceConnected: boolean;
    deviceNo: number;
    isChecked: boolean
}


const StudentDeviceSelect: React.FC<StudentDeviceInterface> = ({ divisionId, setStudentDevices, deviceTypeID, studentDevices }) => {

    const { data, isSuccess, isFetching } = useGetStudentDeviceDetailQuery(divisionId);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [primesysDevices, setPrimesysDevices] = useState<DeviceInterface[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [deviceTypeSelectedID, setDeviceTypeSelectedID] = useState<string>('');
    const { deviceType } = useContext(DeviceTypeContext);

    useEffect(() => {
        if (isSuccess) {
            const checkBoxDevices = data.data.data.result.map((item) => ({
                ...item,
                isChecked: false
            }));
            setPrimesysDevices(checkBoxDevices);
        }
    }, [data, isSuccess]);

    useEffect(() => {
        if (deviceTypeID !== '' && data) {
            const updatedDevice = data?.data.data.result.map((item) => ({
                ...item,
                isChecked: false
            })).filter(item => item.deviceTypeId === Number(deviceTypeID));
            setPrimesysDevices(updatedDevice);
            setSelectAll(false);
        }
    }, [deviceTypeID]);


    const finalFilteredDevices = useMemo(() => {
        const searchDevices = searchInput ? primesysDevices.filter((item) => item.deviceNo === Number(searchInput) || item.imeiNo === Number(searchInput) || item.name.toLowerCase().includes(searchInput.toLowerCase())) : primesysDevices;
        return deviceTypeSelectedID ? searchDevices.filter((item) => item.deviceTypeId === Number(deviceTypeSelectedID)) : searchDevices;

    }, [searchInput, deviceTypeSelectedID, data, primesysDevices]);


    const onHandleAll = () => {

        if (selectAll === true) {
            setSelectAll(false);
            const updateList = finalFilteredDevices.map((device) => ({
                ...device,
                isChecked: false
            }));
            setPrimesysDevices(updateList);
            setStudentDevices('');
        }
        else if (selectAll === false) {
            setSelectAll(true);
            const updateList = finalFilteredDevices.map((device) => ({
                ...device,
                isChecked: true
            }));
            const updateImeis = finalFilteredDevices.map((item) => (item.imeiNo));
            setStudentDevices(updateImeis.join(','));
            setPrimesysDevices(updateList);
        }

    }

    const clearAll = () => {
        const updateList = finalFilteredDevices.map((device) => ({
            ...device,
            isChecked: false
        }));
        // const updateImeis = finalFilteredDevices.map((item) => (item.imeiNo));
        setStudentDevices("");
        setPrimesysDevices(updateList);
        setSelectAll(false);
    }

    const handleDeviceSelect = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectAll(false);
        const { checked, name } = e.target;
        const updateList = finalFilteredDevices.map((item) => item.imeiNo === Number(name) ? { ...item, isChecked: checked } : item);
        setPrimesysDevices(updateList);
        const updatedImeis = updateList.filter(item => item.isChecked === true).map(item => item.imeiNo);
        setStudentDevices(updatedImeis.join(','));
    }


    return (
        <>
            <div>
                <div className="w-full mb-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-full">
                            <input type="search" onChange={(e) => setSearchInput(e.target.value)} className="text-black border-2 border-black w-full rounded-md text-sm outline-none py-2 px-2 mb-4" placeholder="Search device" name="" id="" />
                        </div>
                        <select onChange={(e) => {
                            clearAll();
                            setDeviceTypeSelectedID(e.target.value)
                        }} className="text-black border-2 border-black w-full rounded-md text-sm outline-none py-2 px-2 mb-4">
                            <option value="">Select Device Type</option>
                            {
                                deviceType?.data.result.map((device) => (
                                    <option key={device.id} value={device.deviceTypeId}>{device.deviceType}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex gap-5 items-center">
                        <div className="px-2">
                            <label className="border-2 cursor-pointer border-white bg-primary text-white rounded-lg py-3 px-4">
                                <input type="checkbox" id="allCheckbox" onChange={onHandleAll} checked={selectAll} />
                                <span className="ml-2">{selectAll ? 'All Selected' : '!Select All'}</span>
                            </label>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <span className="font-bold">Total Device: </span>{finalFilteredDevices.length}
                            </div>

                            <div>
                                <span className="font-bold">Selected Devices: </span> {studentDevices.split(",").filter((v): v is string => !!v).length}
                            </div>
                        </div>
                    </div>

                </div>

            </div>


            <div className="flex justify-center overflow-hidden flex-wrap w-full gap-4 max-h-[80vh] scrollbarContainer py-2">
                {
                    primesysDevices ?
                        isFetching
                            ?
                            <CircularProgress isIndeterminate color='blue.300' />
                            :
                            <>
                                {
                                    finalFilteredDevices.map((item, index) => (
                                        <Button className={` py-2 ${item.isChecked && 'border-primaryDark !bg-white'}   w-80 px-6 border-2 cursor-pointer`} key={index}>
                                            <label className="cursor-pointer flex items-center justify-center w-full">
                                                <input type="checkbox" value={item.imeiNo} name={`${item.imeiNo}`} checked={item.isChecked} onChange={handleDeviceSelect} id={item.deviceId} className="mr-2" />
                                                <span className={`${item.isChecked && 'font-bold text-primaryDark'}`}>{item.name}</span>
                                            </label>

                                        </Button>
                                    ))
                                }
                            </>
                        :
                        <>
                            <div className="w-full text-center">
                                <span className="font-semibold">No Devices Available</span>
                            </div>
                        </>
                }
            </div>

        </>
    )
}



export default StudentDeviceSelect;