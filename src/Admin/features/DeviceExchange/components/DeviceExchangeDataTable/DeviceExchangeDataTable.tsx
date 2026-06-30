import React, { useContext, useEffect, useState } from "react";
import { useGetDeviceExchangeDevices } from "../../hooks/device-exchange-api";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { getTimeStampToDate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import DeviceTypeId from "../../../../../data/StudentFilter/StudentFilter.json";
import { Input } from "@chakra-ui/react";
import { DeviceExchangeIntitialState, IDeviceExchangeInterface } from "../../interface/DeviceExchangeResponseInterface";

const DeviceExchangeDataTable = () => {
    const { userDetail } = useContext(UserDetailContext);

    const [size, setSize] = useState<number>(50); // fetch 50 at a time
    const [apiPage, setApiPage] = useState<number>(0); // API page
    const [localPage, setLocalPage] = useState<number>(0); // show 10 records per page locally
    const [exchangeSearch, setExchangeSearch] = useState<string>("");
    const [oldRecords, setOldRecords] = useState<[IDeviceExchangeInterface]>([DeviceExchangeIntitialState]);
    // const [exchangeRecords, setExchangeRecords] = useState<[IDeviceExchangeInterface]>([DeviceExchangeIntitialState]);
    const { data, isSuccess } = useGetDeviceExchangeDevices({
        page: apiPage,
        size,
        userLoginId: userDetail.data.result.userName,
    });
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(data?.data.data?.result.number ?? 0);

    useEffect(() => {
        if (isSuccess && data) {
            const oldData = oldRecords;
            oldData.push(...data.data.data.result.content);
            // setExchangeRecords(...exchangeRecords, data.data.data.result.content);

            console.log(oldData, "Old data");
            if (oldRecords.length == 1) {
                setOldRecords(data.data.data.result.content);
            }
        }
    }, [data, isSuccess]);



    const result = data?.data?.data?.result;
    const content = result?.content || [];
    const totalRecords = result?.totalElements || 0;

    const recordsPerPage = 10;
    const totalLocalPages = Math.ceil(content.length / recordsPerPage);
    const totalOverallPages = data ? Math.floor(data?.data.data.result.numberOfElements / 10) : 0;


    const currentRecords = content.slice(
        localPage * recordsPerPage,
        (localPage + 1) * recordsPerPage
    );

    const filteredRecords = exchangeSearch
        ? data?.data.data.result.content.filter((item) => {
            return (
                item.newDeviceIMEI == Number(exchangeSearch) ||
                item.newDeviceName.toLowerCase().includes(exchangeSearch.toLowerCase())
            );
        })
        : currentRecords;


    const handlePrevious = () => {
        if (currentPageNumber > 0) {
            setCurrentPageNumber(() => currentPageNumber - 1);
        }

        if (localPage > 0) {
            setLocalPage(localPage - 1);
        } else if (apiPage > 0) {
            // go to previous API page
            setApiPage(apiPage - 1);
            setLocalPage(Math.floor(size / recordsPerPage) - 1);
        }
    };

    const handleNext = () => {
        if (currentPageNumber < totalOverallPages) {
            setCurrentPageNumber(() => currentPageNumber + 1);
        }
        if (localPage < totalLocalPages - 1) {
            setLocalPage(localPage + 1);
        } else if ((apiPage + 1) * size < totalRecords) {
            // fetch next batch
            setApiPage(apiPage + 1);
            setSize(size + 50); // increase batch size if you want
            setLocalPage(0);
        }
    };

    return (
        <div className="space-y-4">
            <div className="my-6 px-4 py-3">
                <Input onChange={(e) => setExchangeSearch(e.target.value)} type="text" className="max-w-72 !border-black !border-2 !bg-white" placeholder="Search by New ImeiNo and Name...." />
            </div>
            <table className="w-full border-2 bg-white border-black">
                <thead>
                    <tr className="bg-primaryDark">
                        <th colSpan={2} className="border border-white p-2 text-white text-left">Old Device</th>
                        <th colSpan={2} className="border border-white p-2 text-white text-left">New Device</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords && filteredRecords.map((item, index) => (
                        <React.Fragment key={item.id || index}>
                            <tr>
                                <td className="pt-4 px-6 font-bold text-[20px]" colSpan={4}>
                                    {index + 1 + localPage * recordsPerPage + apiPage * size}.
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old Device IMEI</td>
                                <td className="border border-black p-2">{item.oldDeviceIMEI}</td>
                                <td className="border border-black p-2 font-medium">New Device IMEI</td>
                                <td className="border border-black p-2">{item.newDeviceIMEI}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old Device Name</td>
                                <td className="border border-black p-2">{item.oldDeviceName}</td>
                                <td className="border border-black p-2 font-medium">New Device Name</td>
                                <td className="border border-black p-2">{item.newDeviceName}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old SimNo</td>
                                <td className="border border-black p-2">{item.oldDeviceSimNo}</td>
                                <td className="border border-black p-2 font-medium">New SimNo</td>
                                <td className="border border-black p-2">{item.newDeviceSimNo}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old Sim IMEI No</td>
                                <td className="border border-black p-2">{item.oldDeviceSimIMEINo}</td>
                                <td className="border border-black p-2 font-medium">New Sim IMEI No</td>
                                <td className="border border-black p-2">{item.newDeviceSimIMEINo}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old Device No</td>
                                <td className="border border-black p-2">{item.oldDeviceNo}</td>
                                <td className="border border-black p-2 font-medium">New Device No</td>
                                <td className="border border-black p-2">{item.newDeviceNo}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Old Device Type</td>
                                <td className="border border-black p-2">{DeviceTypeId.find(x => x.deviceId == item.oldDeviceTypeId)?.name}</td>
                                <td className="border border-black p-2 font-medium">New Device Type</td>
                                <td className="border border-black p-2">{DeviceTypeId.find(x => x.deviceId == item.newDeviceTypeId)?.name}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Division ID</td>
                                <td className="border border-black p-2">{item.divisionId}</td>
                                <td></td><td></td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2 font-medium">Exchange By</td>
                                <td className="border border-black p-2">{item.exchangeBy}</td>
                                <td className="border border-black p-2 font-medium">Exchange Time</td>
                                <td className="border border-black p-2">{getTimeStampToDate(item.exchangeAt)}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrevious}
                    disabled={apiPage === 0 && currentPageNumber === 0}
                    className="px-4 py-2 border bg-primaryDark text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm">
                    Page {currentPageNumber + 1} of {totalOverallPages}
                </span>

                <button
                    onClick={handleNext}
                    disabled={(apiPage * size + (localPage + 1) * recordsPerPage) >= totalRecords}
                    className="px-4 py-2 bg-primaryDark text-white border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DeviceExchangeDataTable;
