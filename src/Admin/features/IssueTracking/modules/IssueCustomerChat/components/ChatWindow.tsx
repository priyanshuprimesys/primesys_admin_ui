import React from "react";
import { IDeviceIssueResponseInterface } from "../../../interfaces/DeviceIssueResponseInterface"
import {getCutomTimeStampToTime } from "../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";

interface ChatWindowInterface{
    chat:IDeviceIssueResponseInterface;
    setChat:(chat:IDeviceIssueResponseInterface | null) => void;
}


export const ChatWindow: React.FC<ChatWindowInterface> = ({ chat,setChat }) => {


  return (
    <div className="fixed bottom-4 right-4 w-[25vw] h-[60vh] bg-white border border-gray-400 rounded-2xl shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-300 rounded-t-2xl">
        <div className="flex flex-col">
            <h2 className="text-lg font-bold">{chat.groupName}</h2>
            <h3 className="text-sm font-medium">{chat.senderName}</h3>
        </div>
        <button onClick={()=> setChat(null)} className="text-red-500 hover:text-red-700">✕</button>
      </div>

    <div className="flex flex-col flex-1 w-full p-3 space-y-2 overflow-y-auto">
        <div className="self-start flex flex-col max-w-[80%] bg-gray-200 text-black px-3 py-2 rounded-xl">
            <h1>
                {chat.message}
            </h1>
            <h2 className="self-end text-xs font-medium">
                {getCutomTimeStampToTime(chat.postTime)}
            </h2>
        </div>
        {
            chat?.comments.filter(item=> item.text != '').map((item,index)=>(
                <div key={index} className="self-end flex flex-col max-w-[80%] bg-green-500 text-white px-3 py-2 rounded-xl">
                    <h1>
                        {item.text}
                    </h1>
                    <h2 className="self-end">
                        {getCutomTimeStampToTime(chat?.updatedAt)}
                    </h2>
                </div>
            ))
        }
        
    </div>

      <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-gray-50 rounded-b-2xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-green-500"
        />
        <button className="px-4 py-2 text-white bg-green-500 rounded-full hover:bg-green-600">
          Send
        </button>
      </div>
    </div>
  );
};