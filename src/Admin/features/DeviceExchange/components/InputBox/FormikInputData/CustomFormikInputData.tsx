import { useField } from "formik";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { IconComponents } from "../../../../../../global/Icons/IconsStore";
import { useOutsideClickHandler } from "../../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import { DeviceExchangeStudentContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";





const CustomFormikStudentData = ({ placeHolder, ...props }: any) => {

    const [field, meta,helpers] = useField(props);
    const [dataList, setDataList] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>("");
    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(dataList);
    const { divisionStudentDevices, setStudentDeviceId } = useContext(DeviceExchangeStudentContext);


    useEffect(() => {
        setStudentDeviceId('');
    }, []);


    useEffect(() => {
        if (dataList) {
            SetIsComponentVisible(true);
        } else {
            SetIsComponentVisible(false);
        }
    }, [dataList]);


    useEffect(() => {
        if (!isComponentVisible && dataList) {
            setDataList(false);
        }
    }, [isComponentVisible]);


    const handleDataListActive = () => {
        setDataList(!dataList);
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataList(true);
        setSelectedInput(e.target.value);
        // helpers.setValue(e.target.value);
        if (e.target.value == "") {
            setStudentDeviceId('');
        }
    }


    const handleUserSelect = (name: string,  imeiNo: number) => {
        setSelectedInput(`${name} (${imeiNo})`);
        setDataList(false);
        helpers.setValue(imeiNo);
    }


    const filtereData = selectedInput ? divisionStudentDevices.data.result.filter(x => x.name.toLowerCase().includes(selectedInput.toLowerCase())) : divisionStudentDevices.data.result

    return (
        <>
            <div className="relative w-full">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        {IconComponents.searchIcon}
                    </div>
                    <input
                        {...field}
                        {...props}
                        className="sr-only"
                        placeholder={placeHolder}
                    />
                    <input
                        type="search"
                        value={selectedInput}
                        onClick={handleDataListActive}
                        onChange={handleSearchInput}
                        className="block w-full px-2 py-3 font-medium text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none text-xss ps-10 focus:border-black"
                        placeholder={placeHolder}
                    />
                    {
                        meta.touched && meta.error ? (
                            <div className="mt-1 font-light text-red-600 text-error">
                                {meta.error}
                            </div>
                        ) : null
                    }
                </div>
                <div>
                    {
                        dataList && isComponentVisible && (
                            <div ref={ref} className="`w-full z-50  px-3 py-2 mt-2 cursor-pointer absolute dataScroll bg-gray-200 max-h-72">
                                {
                                    filtereData ? 
                                    filtereData.map((val,index)=>(
                                        <h3 className="px-2 py-2 border-b-2 border-black text-xss text-wrap" onClick={()=>handleUserSelect(val.name,val.imeiNo)} key={index}>
                                            {`${val.name} (${val.imeiNo})`}
                                        </h3>
                                    ))
                                    :
                                    <p>
                                        No Device Available
                                    </p>
                                }
                            </div>
                        )
                    }
                </div>
            </div>

        </>


    )
}

export default CustomFormikStudentData;
