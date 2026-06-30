import { ChangeEvent, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { IconComponents } from "../../../../../../global/Icons/IconsStore";
import ConfigCss from '../../../styles/modules/ConfigCss.module.css';
import { useOutsideClickHandler } from "../../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import { useGetDeviceCommand } from "../../../../../../api/queries/app/hooks/device-command-hooks";
import { StudentDeviceDetailContext } from "../../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { DeviceCommandContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { DeviceStudentSelectContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";












const ConfigCommandSearchSelect = () => {


    const [commandListActive, setCommandListAcitve] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>('');
    const { setSelectedCommand, setCustomCommand } = useContext(StudentDeviceDetailContext);
    const { setDeviceCommand, setPeriodCommandBool, deviceCommand } = useContext(DeviceCommandContext);
    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(commandListActive);
    const { studentSelectedDevices, setStudentSelectedDevices } = useContext(DeviceStudentSelectContext);
    const { data } = useGetDeviceCommand();


    useEffect(() => {
        if (commandListActive) {
            SetIsComponentVisible(true);
        } else {
            SetIsComponentVisible(false);
        }
    }, [commandListActive]);

    useEffect(() => {
        if (!isComponentVisible && commandListActive) {
            setCommandListAcitve(false);
        }
    }, [isComponentVisible]);

    useEffect(() => {
        if (deviceCommand == "") {
            setSelectedInput("");
        }
    }, [deviceCommand]);



    const handleCommandActive = () => {
        setCommandListAcitve(!commandListActive);
    }



    const handleSelectedData = (opt: string, title: string, custom: boolean, command: string, id: number) => {

        if (id == 11) {
            setPeriodCommandBool(true);
        } else {
            if (studentSelectedDevices.length > 0) {
                const uniqueStudentDevices = _.uniqBy(studentSelectedDevices.flat(), 'device_imei');
                setStudentSelectedDevices(uniqueStudentDevices);
            }
            setPeriodCommandBool(false);
        }

        setSelectedInput(opt);
        setCommandListAcitve(false);
        setSelectedCommand(title);
        setCustomCommand(custom);
        if (custom == false) {
            const setUniqueSelectedDevices = _.uniqBy(studentSelectedDevices.flat(), 'device_imei');
            setUniqueSelectedDevices.forEach((student) => {
                student.command = command
            });
            setStudentSelectedDevices(setUniqueSelectedDevices);
            setDeviceCommand(command);
        }
    }


    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedInput(e.target.value);
        setCommandListAcitve(true);
        if (e.target.value == '') {
            setCustomCommand(false);
            setDeviceCommand('');
            setPeriodCommandBool(false);
        }

    }


    const filteredDeviceCommand = selectedInput ? data?.data.data.result.filter(x => x.title.toLowerCase().includes(selectedInput.toLowerCase())) : data?.data.data.result;




    return (
        <>
            <div className="relative w-full">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        {IconComponents.commandIcon}
                    </div>
                    <input
                        type="search"
                        value={selectedInput}
                        className="flex w-full px-2 py-3 text-xs text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black"
                        onClick={handleCommandActive}
                        placeholder="Select Command"
                        onChange={(e) => handleSearchInput(e)}
                    />
                </div>


                {
                    commandListActive && isComponentVisible && (
                        <div ref={ref} className={`w-full px-3 py-2 mt-2 cursor-default absolute z-10 bg-gray-200 max-h-72 ${ConfigCss.commandDataContainer}`}>
                            {
                                data?.data.data.result ?
                                    filteredDeviceCommand?.map((val, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectedData(val.title, val.title, val.custom, val.command, val.id)}
                                            className="py-1.5 flex cursor-pointer gap-3 text-sm font-medium border-b-2 border-b-white">
                                            <input type="radio"
                                                name="command_data"
                                                id={`${val.id}`}
                                                value={val.title}
                                                className="cursor-pointer"
                                                checked={selectedInput.includes(val.title)}
                                                readOnly />
                                            <p>
                                                {val.title}
                                            </p>
                                        </div>
                                    ))
                                    :
                                    <p className="m-0 text-center">
                                        No Command Found
                                    </p>
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default ConfigCommandSearchSelect
