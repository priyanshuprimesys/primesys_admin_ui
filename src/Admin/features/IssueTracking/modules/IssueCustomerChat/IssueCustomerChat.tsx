import { useContext, useState } from "react"
import { IssueContext } from "../../context/IssueContext/IssueContext";
import { getCutomTimeStampToTime } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { PiChatCircleDots } from "react-icons/pi";
import { ChatWindow } from "./components/ChatWindow";
import { IDeviceIssueResponseInterface } from "../../interfaces/DeviceIssueResponseInterface";






export const IssueCustomerChat = () =>{
    const [inputSearch,setInputSearch] = useState<string>("");
    const {userPerMessages} = useContext(IssueContext);
    const [chatMessage,setChatMessage] = useState<IDeviceIssueResponseInterface | null>(null);
    const IssueStatusColorMap: Record<string, string> = {
    OPEN: "#e4ef07",
    INPROGRESS: "#b10202",
    UNDEROBSERVATION: "#ffcfc9",
    SOFTCLOSE: "#6da80a",
    CLOSE: "#0de513",
    };

    // console.log("user chat issue",userPerMessages);
    // const groupNames = useMemo(()=> {
    //     return Array.from(new Set(userPerMessages.map(item => item.groupName)));
    // },[userPerMessages]);

    const handleSelectChatId = (id:string) =>{
        const chat = userPerMessages.filter(item=>item.id.includes(id))[0];
        setChatMessage(chat);
    }

    return(
        <div className="relative">
            <div className="mb-4">
                <input type="search" placeholder="Search...." className="w-full py-2 pl-2 border-2 border-black rounded outline-none" value={inputSearch} name="" id="" onChange={(e) => setInputSearch(e.target.value)} />
            </div>
            <div>
                {
                    userPerMessages.sort((a,b)=> b.createdAt - a.createdAt).filter(item => item.groupName.toLowerCase().includes(inputSearch.toLowerCase())).map((item,index)=>(
                        <div  key={index} className="grid justify-between grid-cols-2 px-2 py-4 mb-3 bg-white border-2 border-gray-600 rounded cursor-pointer">
                            <div className="flex items-center w-full gap-5">
                                <h1 className="text-base font-semibold">{item.groupName}</h1>
                                <h2>{item.senderName}</h2>
                                <h2 style={{backgroundColor: IssueStatusColorMap[item.issueStatus]}} className="px-2 py-1 text-black rounded-md">{item.issueStatus}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex justify-end w-full">
                                    <PiChatCircleDots onClick={()=> handleSelectChatId(item.id)} size={22} color="green" />
                                </div>
                                <div className="flex justify-end px-6">
                                    <h3>{getCutomTimeStampToTime(item.postTime)}</h3>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {
                chatMessage != null && (
                    <ChatWindow chat={chatMessage} setChat={setChatMessage} />
                )
            }
        </div>
    )
}