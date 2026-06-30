import { useDisclosure } from "@chakra-ui/react";
import { IconComponents } from "../../../../global/Icons/IconsStore";
import { IDataPacketInterface } from "../interface/IOTDataInterface";
import MoreInfoButton from "./MoreInfoButton";
import { useEffect, useState } from "react";
import DevicePacketResponse from "./DataPacketResponse";
import { getTimeStampToDate } from "../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import ExcelExportIOTData from "./ExcelExportIOTData";

interface IOTDataTableInterface {
    data: IDataPacketInterface[];
    isFetching: boolean;
    pageSize: number;
    dataPageSize: number;
    handleNextPageData: () => void;
    isSuccess: boolean;
}

const PAGE_OPTIONS = [10, 50, 100];

const IOTDataTable: React.FC<IOTDataTableInterface> = ({ data, isFetching, pageSize, handleNextPageData, dataPageSize, isSuccess }) => {
    const [dataPacketResponse, setDataPacketResponse] = useState<string>("");
    const [initialPageSize, setInitialPageSize] = useState<number>(0);
    const [selectedPageSize, setSelectedPageSize] = useState<number>(10);
    const [nextPageSize, setNextPageSize] = useState<number>(10);
    const [nextLimitExceed, setNextLimitExceed] = useState<boolean>(false);
    const { onClose, onOpen, isOpen } = useDisclosure();

    const onHandleResponse = (dataPacket: string) => {
        setDataPacketResponse(dataPacket);
        onOpen();
    };

    useEffect(() => {
        if (isSuccess) {
            setNextLimitExceed(false);
            setNextPageSize(prev => prev + selectedPageSize);
        }
    }, [data, isSuccess]);

    const onHandlePageSize = (value: string) => {
        setInitialPageSize(0);
        setNextPageSize(Number(value));
        setSelectedPageSize(Number(value));
    };

    const handleNextData = () => {
        setInitialPageSize(nextPageSize);
        if (nextPageSize === pageSize) {
            setNextLimitExceed(true);
            handleNextPageData();
            return;
        }
        if (nextPageSize < pageSize) {
            setNextPageSize(prev => prev + selectedPageSize);
            if (nextPageSize === dataPageSize - selectedPageSize) handleNextPageData();
        }
    };

    const handlePrevPage = () => {
        if (initialPageSize > 0) {
            setInitialPageSize(prev => prev - selectedPageSize);
            setNextPageSize(prev => prev - selectedPageSize);
        }
    };

    function packetAddTrue(packet: string): boolean {
        return packet.split("").some(x => x === "+");
    }

    const visible = data.slice(initialPageSize, nextPageSize);

    return (
        <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* ── Toolbar ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                {/* Legend */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-sm border border-gray-300 bg-[#b4f8c8] flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-600">Server</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-sm border border-gray-300 bg-[#fbe7c6] flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-600">Device</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-sm border border-gray-300 bg-orange-500 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-600">Alert (+)</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {data.length > 0 && (
                        <span className="text-xs text-gray-400 font-medium">
                            {visible.length} of {data.length} packets
                        </span>
                    )}
                    <ExcelExportIOTData data={data} />
                </div>
            </div>

            {/* ── Table ── */}
            <div className="flex-1 min-h-0 overflow-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                            <th className="px-4 py-3">Data Packet</th>
                            <th className="px-4 py-3 whitespace-nowrap">Date &amp; Timestamp</th>
                            <th className="px-4 py-3 whitespace-nowrap">Packet Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isFetching ? (
                            <tr>
                                <td colSpan={3} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span className="text-sm">Loading packets…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-16 text-center text-sm text-gray-400">
                                    No data. Select a device and submit to load packets.
                                </td>
                            </tr>
                        ) : (
                            visible.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`transition-colors hover:brightness-95 ${
                                        packetAddTrue(item.packetType)
                                            ? "bg-orange-400"
                                            : item.packetFrom === "server"
                                            ? "bg-[#b4f8c8]"
                                            : "bg-[#fbe7c6]"
                                    }`}
                                >
                                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800 break-all">
                                        <MoreInfoButton
                                            dataPacket={item.packet}
                                            icon={IconComponents.moreInfoIcon}
                                            onHandleClick={() => onHandleResponse(item.packet)}
                                        />
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">
                                        {getTimeStampToDate(item.timestamp)}
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-gray-700">
                                        {item.packetType}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    <button
                        disabled={initialPageSize === 0}
                        onClick={handlePrevPage}
                        className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                        ‹‹ Prev
                    </button>

                    <select
                        value={selectedPageSize}
                        onChange={e => onHandlePageSize(e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-400 bg-white"
                    >
                        {PAGE_OPTIONS.map(n => (
                            <option key={n} value={n}>{n} / page</option>
                        ))}
                    </select>
                </div>

                <span className="text-xs text-gray-500 font-medium">
                    Rows {initialPageSize + 1}–{Math.min(nextPageSize, data.length)} of {data.length}
                </span>

                <button
                    disabled={nextLimitExceed || nextPageSize >= data.length}
                    onClick={handleNextData}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                    Next ››
                </button>
            </div>

            {isOpen && (
                <DevicePacketResponse isOpen={isOpen} onClose={onClose} dataPacket={dataPacketResponse} />
            )}
        </div>
    );
};

export default IOTDataTable;
