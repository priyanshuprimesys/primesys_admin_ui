import { useContext } from "react";
import { IssueContext } from "../../context/IssueContext/IssueContext";
import IssueHeader from "../../utils/IssueMsgHeader";
import { FaRegComment } from "react-icons/fa";



const IssueBucket = () =>{

    const {issueMessageData} = useContext(IssueContext);
    const {chatTitles} = IssueHeader(issueMessageData);

    return(
        <div className="w-full grid grid-cols-4 gap-4">
            {
                chatTitles.map((chat,index)=>(
                    <div key={index} className="bg-gray-200 h-16 items-center hover:bg-gray-100 cursor-pointer hover:border-2 hover:border-gray-500 px-4 py-3 flex justify-between border-[1px] border-gray-600 mb-2 rounded-md">
                        <h2>{chat.groupName}</h2>
                        <div className="flex items-center gap-1">
                            <FaRegComment size={18} />
                            <h3>{chat.length}</h3>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}


export default IssueBucket;