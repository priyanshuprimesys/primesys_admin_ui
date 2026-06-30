import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { AdminDevicesContext } from "../../../../contexts/AppLayout/AdminDevicesContext/AdminDevicesContext";
import { IconComponents } from "../../../../global/Icons/IconsStore";
import { useOutsideClickHandler } from "../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";


interface SelectBoxInterface{
    setDeviceImei: (text:string) => void
}




const SelectBox: React.FC<SelectBoxInterface> = ({setDeviceImei}) =>{

    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const {adminDevices} = useContext(AdminDevicesContext);

    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(dataListActive);

    useEffect(()=>{
        setDeviceImei('');
    },[]);

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
            setDeviceImei("");
        }
    }

    const handleDataSelect = (imeiNo:string) =>{
        setSearchInput(imeiNo);
        setDeviceImei(imeiNo);
        setDataListActive(false);
    }



    const filteredData = searchInput ?  adminDevices.data.result.filter(x => x?.imeiNo === Number(searchInput)) : adminDevices.data.result;



    return (
        <div className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                    {IconComponents.searchIcon}
                </div>
                <input
                    type="search"
                    placeholder={"Enter Device Imei"}
                    className={`block w-full px-2 py-3 text-xs text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black`}
                    onClick={handleDataListActive}
                    onChange={(e) => handleSearchInput(e)}
                    value={searchInput}
                    required />
            </div>

            {
                dataListActive && isComponentVisible && (
                    <div ref={ref} className={"w-full z-10 px-3 py-2 mt-2 cursor-pointer absolute dataScroll bg-gray-200 max-h-72"}>
                        {
                            filteredData ?
                                filteredData.map((val: any, index: any) => (
                                    <h2 className="px-1 py-2 text-xs font-semibold border-b border-black" onClick={() => handleDataSelect(val.imeiNo)} key={index}>
                                        <span className="font-bold">
                                            {val.imeiNo}
                                        </span>
                                        <span className="ml-2">
                                            {`(${val.name})`}
                                        </span>
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

export default SelectBox;