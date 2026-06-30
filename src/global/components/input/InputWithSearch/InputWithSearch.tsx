import { ChangeEvent, useEffect, useState } from "react";
import { useOutsideClickHandler } from "../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import { IconComponents } from "../../../Icons/IconsStore";




interface InputProps {
    placeHolder: string;
    data: any[];
    dataClear?: boolean;
    additionalInfo?: string;
    isSuccess?: boolean;
    isLoading?: boolean;
    name: string;
    selectedVal: string;
    setSelectedValue: (selectedVal: string) => void;
    disabled?: boolean;
    setAdditonalSelectData?: (data: string) => void | undefined;
    setDeviceNo?: (device: number) => void;
    className?: string
    deviceImei?: string
}



const InputWithSearch: React.FC<InputProps> = ({ placeHolder, name, data, setSelectedValue, selectedVal, disabled, setAdditonalSelectData, setDeviceNo, dataClear, className, additionalInfo, deviceImei }) => {

    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const device_no = "deviceNo";

    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(dataListActive);


    useEffect(() => {
        if (!deviceImei) setSelectedValue('');
    }, []);

    useEffect(() => {
        if (deviceImei && data?.length) {
            const deviceData = data.filter((x) => x.imeiNo == Number(deviceImei));
            if (deviceData[0]?.name) setSearchInput(deviceData[0].name);
            setSelectedValue(String(deviceImei));
        }
    }, [deviceImei, data]);



    useEffect(() => {
        if (dataClear === true) {
            setSearchInput("");
            setSelectedValue("");
        }
    }, [dataClear]);

    useEffect(() => {
        if (dataListActive) {
            SetIsComponentVisible(true);
        } else {
            SetIsComponentVisible(false);
        }
    }, [dataListActive]);


    useEffect(() => {
        if (!isComponentVisible && dataListActive) {
            setDataListActive(false);
        }
    }, [isComponentVisible]);

    const handleDataListActive = () => {
        setDataListActive(!dataListActive);
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataListActive(true);
        setSearchInput(e.target.value);
        if (e.target.value == '') {
            setSelectedValue("");
        }
    }

    const handleDataSelect = (value: string, name: string, deviceNo: number) => {
        setSearchInput(name);

        if (setAdditonalSelectData && setDeviceNo) {
            setDeviceNo(deviceNo);
            setAdditonalSelectData(name);
        }
        setSelectedValue(value);
        setDataListActive(false);
    }



    const filteredData = searchInput ? data.filter(x => x?.name.toLowerCase().includes(searchInput.toLowerCase())) : data;



    return (
        <div className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                    {IconComponents.searchIcon}
                </div>
                <input
                    disabled={disabled}
                    type="search"
                    placeholder={placeHolder}
                    className={`block w-full px-2 py-3 text-xs text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black ${className}`}
                    onClick={handleDataListActive}
                    onChange={(e) => handleSearchInput(e)}
                    value={searchInput}
                    required />
            </div>

            {
                dataListActive && isComponentVisible && (
                    <div ref={ref} className={"w-full z-[3000] px-3 py-2 mt-2 cursor-pointer absolute dataScroll bg-gray-200 max-h-72"}>
                        {
                            filteredData ?
                                filteredData.map((val: any, index: any) => (
                                    <h2 className="px-1 py-2 text-xs font-semibold border-b border-black" onClick={() => handleDataSelect(val[`${selectedVal}`], val[`${name}`], val[`${device_no}`])} key={index}>
                                        {additionalInfo ? `${val[name]} (${val[additionalInfo]})` : val[`${name}`]}
                                    </h2>
                                ))
                                :
                                <p className="m-0 text-xs font-medium text-center">No student available</p>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default InputWithSearch
