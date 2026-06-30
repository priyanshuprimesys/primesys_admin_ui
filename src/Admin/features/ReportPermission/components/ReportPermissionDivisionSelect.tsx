import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { fetchDivisionListQuery } from "../data/report-permission-query"
import { DivisionParentIdContext } from "../../../../contexts/AppLayout/Admin/DivisionParentIdContext/DivisionParentIdContext"
import { DataTableContext } from "../../../../contexts/AppLayout/DataTableContext/DataTableContext"
import { useOutsideClickHandler } from "../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler"
import { IconComponents } from "../../../../global/Icons/IconsStore"

interface InputSearchProps {
    placeHolder: string
    setInputData: (selected: string) => void
    setParentUserName?: (text: string) => void
    setParentName?: (text: string) => void
    divisionId?: string
}

const ReportPermissionDivisionSelect: React.FC<InputSearchProps> = ({
    placeHolder,
    setInputData,
    setParentUserName,
    setParentName,
    divisionId,
}) => {
    const [dataListActive, setDataListActive] = useState<boolean>(false);
    const [selectedInput, setSelectedInput] = useState<string>("");

    const { data, isSuccess } = useSuspenseQuery(fetchDivisionListQuery());
    const { setParentDivisionId } = useContext(DivisionParentIdContext);
    const { setGlobalFilter } = useContext(DataTableContext);



    const reportPermissionData = useMemo(() => {
        if (!data.data.data.result) return [];
        return data.data.data.result;
    }, [data, isSuccess]);

    const { ref, isComponentVisible, SetIsComponentVisible } =
        useOutsideClickHandler<HTMLDivElement>(dataListActive)

    useEffect(() => {
        setInputData("")
    }, [])

    useEffect(() => {
        if (divisionId) {
            const parentData =
                reportPermissionData.filter((x) =>
                    x.id.toLowerCase().includes(divisionId.toLowerCase())
                ) ?? []

            setInputData(parentData[0]?.id)
            setParentDivisionId(parentData[0]?.id)

            if (parentData[0]?.userName) {
                setParentUserName ? setParentUserName(parentData[0].userName) : ""
            }

            if (parentData[0]?.id != undefined && parentData[0]?.userName != undefined) {
                setSelectedInput(`${parentData[0]?.name} (${parentData[0]?.userName})`)
            }

            setDataListActive(false)
        }
    }, [divisionId])

    useEffect(() => {
        SetIsComponentVisible(!!dataListActive)
    }, [dataListActive])

    useEffect(() => {
        if (!isComponentVisible && dataListActive) {
            setDataListActive(false)
        }
    }, [isComponentVisible])

    const handleDataListActive = () => {
        setDataListActive(!dataListActive)
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataListActive(true)
        setInputData("")
        setSelectedInput(e.target.value)

        if (e.target.value === "") {
            setInputData("")
            setParentDivisionId("")
            setGlobalFilter("")
            setParentUserName ? setParentUserName("") : ""
            setParentName ? setParentName("") : ""
        }
    }

    const handleUserSelect = (name: string, username: string, deviceId: string) => {
        setSelectedInput(`${name} (${username})`)

        if (username) setParentUserName ? setParentUserName(username) : ""
        if (name) setParentName ? setParentName(name) : ""

        setInputData(deviceId)
        setParentDivisionId(deviceId)

        setDataListActive(false)
        setGlobalFilter("")
    }


    const filteredData = useMemo(() => {
        if (!selectedInput) return reportPermissionData
        const q = selectedInput.toLowerCase()

        return reportPermissionData.filter((x) => {
            const name = (x.name ?? "").toLowerCase()
            const uname = (x.userName ?? "").toLowerCase()
            return name.includes(q) || uname.includes(q)
        })
    }, [selectedInput, reportPermissionData])

    return (
        <div className="relative w-full">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="scale-90 sm:scale-100">{IconComponents.searchIcon}</span>
                </div>

                <input
                    type="search"
                    className="
            w-full rounded-lg border border-gray-300 bg-white
            px-3 py-2 pl-10 text-xs sm:text-sm
            text-gray-900 placeholder:text-gray-400
            outline-none transition
            focus:border-gray-900 focus:ring-2 focus:ring-gray-200
          "
                    onClick={handleDataListActive}
                    onChange={handleSearchInput}
                    value={selectedInput}
                    placeholder={placeHolder || "Search"}
                    required
                />
            </div>

            {/* Dropdown */}
            {dataListActive && isComponentVisible && (
                <div
                    ref={ref}
                    className="
            absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg
          "
                >
                    {/* max height responsive */}
                    <div className="max-h-56 sm:max-h-72 overflow-y-auto">
                        {filteredData?.length ? (
                            filteredData.map((val, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleUserSelect(val.name, val.userName, val.id)}
                                    className="
                    w-full text-left px-3 py-2
                    text-xs sm:text-sm font-medium
                    hover:bg-gray-100 active:bg-gray-200
                    border-b border-gray-100 last:border-b-0
                    flex items-center justify-between gap-2
                  "
                                >
                                    <span className="truncate">
                                        {val.name}{" "}
                                        <span className="text-gray-500 font-normal">
                                            ({val.userName})
                                        </span>
                                    </span>

                                    {/* optional right icon */}
                                    <span className="text-gray-400 text-[10px] sm:text-xs">
                                        Select
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p className="m-0 px-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-500">
                                No parent found
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportPermissionDivisionSelect;
