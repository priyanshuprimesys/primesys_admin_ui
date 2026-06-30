import { ChangeEvent, useContext, useEffect, useState } from "react";
import { IconComponents } from "../../../../Icons/IconsStore";
import { useOutsideClickHandler } from "../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import { DivisionLoginTrackUsersContext } from "../../../../../contexts/AppLayout/Admin/DivisionLoginTrackUsersContext/DivisionLoginTrackUsersContext";
import { DivisionParentIdContext } from "../../../../../contexts/AppLayout/Admin/DivisionParentIdContext/DivisionParentIdContext";
import { DataTableContext } from "../../../../../contexts/AppLayout/DataTableContext/DataTableContext";

interface InputSearchProps {
    placeHolder: string;
    setInputData: (selected: string) => void;
    setParentUserName?: (text: string) => void;
    setParentName?: (text: string) => void;
    setParentWhatsAppName?: (text: string) => void;
    divisionId?: string;
}

const ParentDataSearchSelect: React.FC<InputSearchProps> = ({
    placeHolder,
    setInputData,
    setParentUserName,
    setParentName,
    setParentWhatsAppName,
    divisionId,
}) => {
    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>("");

    const { divisionLoginTrackUserDetails } = useContext(
        DivisionLoginTrackUsersContext
    );

    const { setParentDivisionId } = useContext(
        DivisionParentIdContext
    );

    const { setGlobalFilter } = useContext(DataTableContext);

    const { ref, isComponentVisible, SetIsComponentVisible } =
        useOutsideClickHandler<HTMLDivElement>(dataListActive);

    useEffect(() => {
        setInputData("");
    }, []);

    useEffect(() => {
        if (divisionId) {
            const parentData =
                divisionLoginTrackUserDetails.data.result.filter((x) =>
                    x.id.toLowerCase().includes(divisionId.toLowerCase())
                );

            setInputData(parentData[0]?.id);
            setParentDivisionId(parentData[0]?.id);

            if (parentData[0]?.user_name) {
                setParentUserName?.(parentData[0].user_name);
            }

            if (
                parentData[0]?.id !== undefined &&
                parentData[0]?.user_name !== undefined
            ) {
                setSelectedInput(
                    `${parentData[0]?.name} (${parentData[0]?.user_name})`
                );
            }

            setDataListActive(false);
        }
    }, [divisionId]);

    useEffect(() => {
        SetIsComponentVisible(dataListActive);
    }, [dataListActive]);

    useEffect(() => {
        if (!isComponentVisible && dataListActive) {
            setDataListActive(false);
        }
    }, [isComponentVisible]);

    const handleDataListActive = () => {
        setDataListActive(!dataListActive);
    };

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataListActive(true);
        setInputData("");

        const value = e.target.value;

        setSelectedInput(value);

        if (value === "") {
            setInputData("");
            setParentDivisionId("");
            setGlobalFilter("");

            setParentUserName?.("");
            setParentName?.("");
        }
    };

    const handleUserSelect = (
        name: string,
        username: string,
        deviceId: string,
        whatsappGroupName?: string
    ) => {
        setSelectedInput(`${name} (${username})`);

        setParentUserName?.(username);
        setParentName?.(name);

        if (whatsappGroupName !== undefined) {
            setParentWhatsAppName?.(whatsappGroupName);
        }

        setInputData(deviceId);
        setParentDivisionId(deviceId);

        setDataListActive(false);
        setGlobalFilter("");
    };

    const filteredData = selectedInput
        ? divisionLoginTrackUserDetails.data.result.filter(
            (x) =>
                x.name
                    .toLowerCase()
                    .includes(selectedInput.toLowerCase()) ||
                x.user_name
                    .toLowerCase()
                    .includes(selectedInput.toLowerCase())
        )
        : divisionLoginTrackUserDetails.data.result;

    return (
        <div className="relative w-full">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                    {IconComponents.searchIcon}
                </div>

                <input
                    type="search"
                    value={selectedInput}
                    onClick={handleDataListActive}
                    onChange={handleSearchInput}
                    placeholder={placeHolder || "Search parent"}
                    className="
            w-full
            rounded-2xl
            border
            border-gray-300
            bg-white
            py-3
            pl-12
            pr-4
            text-sm
            font-medium
            text-gray-800
            shadow-sm
            outline-none
            transition-all
            duration-200
            placeholder:text-gray-400
            focus:border-teal-500
            focus:ring-2
            focus:ring-teal-200
          "
                />
            </div>

            {dataListActive && isComponentVisible && (
                <div
                    ref={ref}
                    className="
            absolute
            z-[3000]
            mt-3
            max-h-72
            w-full
            overflow-y-auto
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-2
            shadow-2xl
            backdrop-blur-md
          "
                >
                    {filteredData.length > 0 ? (
                        filteredData.map((val, index) => (
                            <div
                                key={index}
                                onClick={() =>
                                    handleUserSelect(
                                        val.name,
                                        val.user_name,
                                        val.id,
                                        val.whatsapp_group_name
                                    )
                                }
                                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-200
                  hover:bg-teal-50
                  hover:shadow-sm
                  cursor-pointer
                  border-b
                  border-gray-100
                  last:border-none
                "
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {val.name}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        @{val.user_name}
                                    </span>
                                </div>

                                <div className="text-teal-600">
                                    {IconComponents.rightArrowIcon}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center py-6">
                            <p className="text-sm font-medium text-gray-400">
                                No parent found
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentDataSearchSelect;