import { useEffect, useMemo, useState } from "react";
import { Search, Loader } from "lucide-react";
import { useGetIssueMessage } from "../../hooks/getIssueMessage";
import { IIssueInterface } from "../../interfaces/DeviceIssueInterface";
import { getCutomTimeStampToTime } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import ChatWindow from "./IssueMessageChatWindow";


export type Chat = {
    id: number;
    groupName: string;
    lastUpdatedAt: number;
    lastMessage: string;
    totalCount: number | undefined;
    messages: IIssueInterface[];
};


function buildChats(data: IIssueInterface[]): Chat[] {
    const chatMap = new Map<string, Chat>();

    data
        .filter(item => item.groupName &&
            item.groupName !== "Deleting messages…" &&
            item.groupName !== "Backup in progress"
        )
        .sort((a, b) => b.postTime - a.postTime)
        .forEach(item => {
            const existingChat = chatMap.get(item.groupName);
            if (!existingChat) {
                chatMap.set(item.groupName, {
                    id: chatMap.size + 1,
                    groupName: item.groupName,
                    lastUpdatedAt: item.postTime,
                    lastMessage: item.message,
                    totalCount: 1,
                    messages: [item]
                });
            } else {
                existingChat.totalCount ? existingChat.totalCount += 1 : existingChat.totalCount = 1;
                existingChat.messages.push(item);

            }
        });

    return Array.from(chatMap.values());
};


function debounceFunc<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timeOutId: ReturnType<typeof setTimeout>;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}



export default function IssueMessageDashboard() {
    const { data, isSuccess, isLoading, dataUpdatedAt } = useGetIssueMessage();
    const [groupActive, setGroupActive] = useState<boolean>(false);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [allChats, setAllChats] = useState<Chat[]>([]);



    useEffect(() => {
        if (isSuccess && data) {
            const chats = buildChats(data.data.data.flat());
            setAllChats(chats);
        }
    }, [isSuccess, data, dataUpdatedAt]);

    useEffect(() => {
        if (!activeChat) return;

        const updatedChat = allChats.find(
            (c) => c.groupName === activeChat.groupName
        );

        if (updatedChat) {
            setActiveChat(updatedChat);
        }
    }, [allChats]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }

    const debounceResults = useMemo(() => {
        return debounceFunc(handleSearch, 600);
    }, []);

    const filteredChatResults = !searchText ? allChats : allChats.filter(group => group.groupName.toLowerCase().includes(searchText.toLowerCase()));

    const handleChat = (chat: Chat) => {
        setGroupActive(true);
        setActiveChat(chat);
    }


    return (
        <div className="flex h-[82vh] bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 md:w-1/4 bg-white border-r flex flex-col">
                <div className="p-4 bg-green-600 text-white font-semibold">
                    Primesys Team
                </div>

                <div className="p-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="search"
                            onChange={debounceResults}
                            placeholder="Search chats"
                            className="bg-transparent outline-none text-sm w-full"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {
                        isLoading ?
                            <div className="h-full gap-3 flex justify-center items-center">
                                <Loader className="animate-spin" />
                                <div className="text-xss">Loading......</div>
                            </div>
                            :
                            filteredChatResults.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChat(chat)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
                            `}
                                >
                                    <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                                        {chat.groupName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <p className="font-medium text-xs">{chat.groupName}</p>
                                            <p className="text-xs text-gray-500">{getCutomTimeStampToTime(chat.lastUpdatedAt)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-xss text-gray-500 truncate">
                                                {chat.lastMessage.slice(0, 38)}...
                                            </p>
                                            <p className="text-[12px] font-semibold text-gray-800">
                                                {chat.totalCount}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                </div>
            </div>

            <ChatWindow groupActive={groupActive} message={activeChat} />
        </div>
    );
}
