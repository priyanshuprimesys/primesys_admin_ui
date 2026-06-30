import { useEffect, useState } from "react";
import { IEmailMaster } from "../../../interfaces/EmailMasterInterface";


interface IReportMail {
    setReportEmailId: (report: string) => void,
    setReportPassword: (pass: string) => void,
    setEmailLoginPassword: (pass: string) => void,
    data: IEmailMaster[],
    reportEmailId?: string
}




const ReportEmailInput: React.FC<IReportMail> = ({ setReportEmailId, data, setReportPassword, setEmailLoginPassword, reportEmailId }) => {

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");

    console.log("Report eamil", reportEmailId);

    useEffect(() => {
        if (reportEmailId) {
            const emailDetail = data.find((item) => item.email == reportEmailId);
            if (emailDetail) {
                setQuery(emailDetail?.email);
                setReportEmailId(emailDetail.email);
                setEmailLoginPassword(emailDetail.login_password);
                setReportPassword(emailDetail.password);
            }

        }
    }, [reportEmailId]);

    const handleReportEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setShowDropdown(true);
        if (value == "") {
            setQuery(value);
            setShowDropdown(false);
        }
    }

    const handleSelectReport = (e: IEmailMaster) => {
        setQuery(e.email);
        setReportEmailId(e.email);
        setReportPassword(e.password);
        setEmailLoginPassword(e.login_password)
        setShowDropdown(false);
    }


    return (
        <>
            <div className="relative w-full flex flex-col">
                <label htmlFor="report_email" className="text-xss font-semibold">Report Email Id</label>
                <input
                    type="search"
                    onClick={() => setShowDropdown(true)}
                    onChange={(e) => handleReportEmailChange(e)}
                    value={reportEmailId ? reportEmailId : query}
                    placeholder="Enter Report Email Id"
                    className="px-2 py-2 border-2 border-black rounded-md"
                />

                {
                    showDropdown &&
                    (
                        <div className="z-50 absolute h-56 border-[1px] border-gray-800 bg-white top-16 w-full overflow-auto left-0">
                            {
                                data.map((item, index) => (
                                    <div className="py-1 px-2 cursor-pointer border-b-2 border-black" onClick={() => handleSelectReport(item)} key={index}>
                                        <div>{item.email}</div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

            </div>
        </>
    )
}


export default ReportEmailInput;