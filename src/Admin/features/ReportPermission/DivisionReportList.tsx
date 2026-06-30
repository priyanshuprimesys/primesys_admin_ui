import { Input } from "@chakra-ui/react";
import { useGetEmailMaster } from "../HirearchyModule/services/hooks";
import { useState } from "react";






const DivisionReportList = () => {

    const { data } = useGetEmailMaster();
    const [query, setQuery] = useState<string>("");


    const filteredData = data?.data.data.result.filter((report) => query ? report.email.toLowerCase().includes(query.toLowerCase()) : report);

    return (
        <>
            <div className="my-2">
                <Input type="search" onChange={(e) => setQuery(e.target.value)} className="max-w-sm !border-2 !border-blue-500 !bg-gray-50 placeholder:text-gray-400" placeholder="Search by report name" />
            </div>
            <div className="overflow-x-auto max-h-[75vh]">

                <table className="min-w-full border border-gray-200 border-collapse">
                    <thead className="sticky top-0 bg-gray-100 z-20">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                ID
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                Email
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                Division Names
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                Email Password
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                Password
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                Status
                            </th>

                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            filteredData?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-600">{++index}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{item.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                        {item.divisions.map((division, index) => (
                                            <div key={index}><b>{++index}</b>.{division}</div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{item.password}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">
                                        {item.login_password}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                                            {item.active_status ? 'True' : 'False'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>

    )
}


export default DivisionReportList;