import IssueHeader from "../../utils/IssueMsgHeader";
import { useContext, useEffect, useState } from "react";
import { IssueContext } from "../../context/IssueContext/IssueContext";
import { Input } from "@chakra-ui/react";
import { getCutomTimeStampToTime } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";

const IssueHeaders = () => {

    const {setIssueHeader,issueHeader,issueMessageData,setTotalGroups} = useContext(IssueContext);
    const {chatTitles} = IssueHeader(issueMessageData);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchInput,setSearchInput]  = useState<string>("");



    useEffect(()=>{
        if(issueHeader === '')
        {
            setActiveIndex(null);
        }
    },[issueHeader]);

    useEffect(()=>{
        setTotalGroups(chatTitles.length);
    },[chatTitles]);

    const handleClick = (index: number,header:string) => {
      setActiveIndex(index === activeIndex ? null : index);
      setIssueHeader(header);
    };
  return (
    <>
        
    <div className="mb-4">
        <Input onChange={(e) => setSearchInput(e.target.value)} type="search" className="!bg-white !border-2 !border-black" placeholder='Search group' />
    </div>
    {
        chatTitles.filter(x => x.groupName.toLowerCase().includes(searchInput.toLowerCase())).sort((a,b) => b.msgTime - a.msgTime)
        .map((item,index)=>(
            <div
            key={index}
            onClick={() => handleClick(index,item.groupName)}
            className={`py-3 border-b cursor-pointer rounded flex px-2 justify-between items-center text-base font-medium border-black ${
            activeIndex === index
                ? "text-gray-950 border-l-4 border-dark bg-gray-200"
                : "text-gray-700 bg-white"
            }`}
        >
            <h2 className="text-sm text-left">{item.groupName}</h2>
            <div>
                <h3 className="text-[11px] font-medium text-[#0f1626]">{getCutomTimeStampToTime(item.msgTime)}</h3>
                <h3 className="text-xs font-bold underline text-dark underline-offset-2">{item.length}</h3>
            </div>
        </div>
        ))
    }

    </>
  )
}



export default IssueHeaders;