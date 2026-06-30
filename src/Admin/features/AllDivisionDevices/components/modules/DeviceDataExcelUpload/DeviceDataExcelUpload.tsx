import { useContext, useState } from "react"
import ParentDataSearchSelect from "../../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import { useGetAdminDivisionDevice } from "../../../../../../api/queries/app/hooks/admin_get_all_division_device_api_hooks";
import { ExcelExport } from "./components/ExcelExports";
import DropFileInput from "./components/DropFileInput";
import { toast } from "react-toastify";
import { Input, Select } from "@chakra-ui/react";
import { DeviceTypeContext } from "../../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

export interface FiledArrayInterface {
    label: string,
    name: string,
    isChecked: boolean,
}

const fieldsArray: FiledArrayInterface[] = [
    {
        label: "Imei",
        name: "device_imei",
        isChecked: true,
    },
    {
        label: "Report Time Margin",
        name: "report_time_margin",
        isChecked: true,
    },
    {
        label: "Report Dist Margin",
        name: "report_dist_margin",
        isChecked: true,
    },
    {
        label: "On Track Margin",
        name: "on_track_margin",
        isChecked: true,
    },
    {
        label: "Device Name",
        name: "device_name",
        isChecked: true,
    },
    {
        label: "Device Sim No",
        name: "device_sim_no",
        isChecked: true,
    },
    {
        label: "Device Sim Imei No",
        name: "device_sim_imei_no",
        isChecked: true,
    },
    {
        label: "Device No",
        name: "device_no",
        isChecked: true,
    },
    {
        label: "Trip Wise Report",
        name: "trip_wise_report",
        isChecked: true,
    },
    {
        label: "Active Status",
        name: "active_status",
        isChecked: true,
    },
    {
        label: "Report Enable",
        name: "report_enable",
        isChecked: true,
    },
    {
        label: "Device Type Id",
        name: "deviceTypeId",
        isChecked: true
    }
];

export interface ExcelLockedField {
    device_imei: boolean,
    report_time_margin: boolean,
    report_dist_margin: boolean,
    on_track_margin: boolean,
    device_name: boolean,
    device_sim_no: boolean,
    device_sim_imei_no: boolean,
    device_no: boolean,
    trip_wise_report: boolean,
    active_status: boolean,
    report_enable: boolean
}





export const DeviceDataExcelUpload = () => {

    const [parentId, setParentId] = useState<string>("");
    const [deviceSelect, setDeviceSelect] = useState<string>("");
    const [excelLockedFieldVal, setExcelLockedFieldVal] = useState<FiledArrayInterface[]>(fieldsArray);
    const [exportDevice, setExportDevice] = useState<string>("");
    const { deviceType } = useContext(DeviceTypeContext);




    const { data, isFetching } = useGetAdminDivisionDevice(parentId);


    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const updateExcelVal = excelLockedFieldVal.map((user) => user.name == name ? { ...user, isChecked: checked } : user);
        if (updateExcelVal.filter(item => item.isChecked == false).length > 1) {
            toast.error("Cannot select more than one field");
            return;
        }
        setExcelLockedFieldVal(updateExcelVal);
    }



    return (
        <div>
            <ParentDataSearchSelect placeHolder="Search Division" setInputData={setParentId} />
            <div className="my-4">
                {
                    isFetching ?
                        <>Loading.......</>
                        :
                        (
                            <div className="grid grid-cols-[450px_200px_200px] items-center gap-4">
                                <div>
                                    <Input
                                        className="!border-2 !border-black outline-none focus:outline-none focus:border-none"
                                        value={exportDevice}
                                        onChange={(e) => setExportDevice(e.target.value)}
                                        placeholder="Enter device number to export" />
                                </div>
                                <div>
                                    <Select className="border-2 border-primaryDark" onChange={(e) => setDeviceSelect(e.target.value)}>
                                        {
                                            deviceType?.data.result.map((item, index) => (
                                                <option key={index} value={item.deviceTypeId}>{item.deviceType}</option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <ExcelExport devices={exportDevice} deviceType={deviceSelect} lockedData={excelLockedFieldVal} data={data?.data ? data.data.data.result : []} />

                            </div>
                        )

                }

            </div>
            <div className="my-7">
                <h1 className="mb-4 text-lg font-semibold">Please uncheck those fields to edit and update</h1>
                <div className="flex flex-wrap gap-8 mb-8">
                    {
                        excelLockedFieldVal.map((item, index) => (
                            <div key={index} className="flex items-center space-x-1">
                                <label htmlFor={item.name}>{item.label}</label>
                                <input onChange={(e) => handleSelect(e)} checked={item.isChecked} type="checkbox" className="cursor-pointer" name={item.name} id={item.name} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 px-3">
                <DropFileInput />
            </div>



        </div>
    )
}