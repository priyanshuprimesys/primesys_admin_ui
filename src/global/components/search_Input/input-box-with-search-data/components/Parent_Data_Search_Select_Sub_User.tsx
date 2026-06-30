import { ChangeEvent, useContext, useEffect, useState } from "react";
import { IconComponents } from "../../../../Icons/IconsStore";
import { useOutsideClickHandler } from "../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import ParentDataStyle from "../styles/modules/ParentDataStyle.module.css";
import { DivisionParentIdContext } from "../../../../../contexts/AppLayout/Admin/DivisionParentIdContext/DivisionParentIdContext";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";
import { fetchDivisionListQuery } from "../../../../../Admin/features/ReportPermission/data/report-permission-query";
import { useSuspenseQuery } from "@tanstack/react-query";

interface InputSearchProps {
    placeHolder: string;
    setInputData: (selected: string) => void;
    setParentUserName?: (text: string) => void;
    setParentName?: (text: string) => void;
    divisionId?: string
}




const ParentDataSearchSelectSubUser: React.FC<InputSearchProps> = ({ placeHolder, setInputData, setParentUserName, setParentName, divisionId }) => {

    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>('');
    const { data } = useSuspenseQuery(fetchDivisionListQuery());
    const { setParentDivisionId } = useContext(DivisionParentIdContext);
    const { setGlobalFilter } = useContext(DataTableContext);
    /**outside click handler */
    const { ref, isComponentVisible, SetIsComponentVisible } = useOutsideClickHandler<HTMLDivElement>(dataListActive);


    useEffect(() => {
        setInputData('');
    }, []);


    useEffect(() => {
        if (divisionId) {
            const parentData = data?.data.data.result.filter((x) => x.id.toLowerCase().includes(divisionId.toLowerCase())) ?? [];
            setInputData(parentData[0]?.id);
            setParentDivisionId(parentData[0]?.id);
            if (parentData[0]?.userName) {
                setParentUserName ? setParentUserName(parentData[0].userName) : '';
            }

            if (parentData[0]?.id != undefined && parentData[0]?.userName != undefined) {
                setSelectedInput(`${parentData[0]?.name} (${parentData[0]?.userName})`);
            }


            setDataListActive(false);
        }
    }, [divisionId]);


    useEffect(() => {
        if (dataListActive) {
            SetIsComponentVisible(true);
        }
        else {
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
        setInputData('');
        setSelectedInput(e.target.value);
        if (e.target.value == '') {
            setInputData('');
            setParentDivisionId('');
            setGlobalFilter('');
            setParentUserName ? setParentUserName('') : '';
            setParentName ? setParentName('') : '';
        }

    }



    const handleUserSelect = (name: string, username: string, deviceId: string) => {
        setSelectedInput(`${name} (${username})`);
        if (username) {
            setParentUserName ? setParentUserName(username) : '';
        }
        if (name) {
            setParentName ? setParentName(name) : '';
        }
        setInputData(deviceId);
        setParentDivisionId(deviceId);
        setDataListActive(false);
        setGlobalFilter('');
    }

    const filteredData =
        data?.data && selectedInput
            ? data.data.data.result.filter(x =>
                (x.name ?? '').toLowerCase().includes(selectedInput.toLowerCase()) ||
                (x.userName ?? '').toLowerCase().includes(selectedInput.toLowerCase())
            )
            : data?.data.data.result;
    return (
        <>
            <div className="relative w-full ">
                <div className="relative">
                    <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                        {IconComponents.searchIcon}
                    </div>
                    <input
                        type="search"
                        className="block w-full px-2 py-3 text-xs text-black bg-gray-300 border-2 border-gray-500 rounded-lg outline-none ps-10 focus:border-black"
                        onClick={handleDataListActive}
                        onChange={(e) => handleSearchInput(e)}
                        value={selectedInput}
                        placeholder={placeHolder ? placeHolder : 'Search'}
                        required />
                </div>

                {
                    dataListActive && isComponentVisible && (
                        <div ref={ref} className={`w-full z-40  px-3 py-2 mt-2 cursor-pointer absolute ${ParentDataStyle.parentDataContainer} bg-gray-200 max-h-72`}>
                            {
                                filteredData ?
                                    filteredData.map((val, index) => (
                                        <p
                                            onClick={() => handleUserSelect(val.name, val.userName, val.id)}
                                            className="py-1.5 text-sm font-medium border-b-2 border-b-white"
                                            key={index}>
                                            {`${val.name} (${val.userName})`}
                                        </p>
                                    ))
                                    :
                                    <p className="m-0 text-xs font-medium text-center">No parent found</p>
                            }
                        </div>
                    )
                }
            </div>

        </>

    )
}

export default ParentDataSearchSelectSubUser;
