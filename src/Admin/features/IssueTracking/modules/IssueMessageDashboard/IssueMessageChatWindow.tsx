import { Search } from "lucide-react"
import { Chat } from "./IssueMessageDashboard";
import { getCutomTimeStampToTime } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { issuePickableQuery, usePostIssueMessage } from "../../hooks/postIssueMessage";
import { IssueCreateNewModel } from "../../components/IssueDashboard/Components/IssueEditModule/components/IssueCreateNewModel";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { IIssueInterface } from "../../interfaces/DeviceIssueInterface";
import { useQuery } from "@tanstack/react-query";


interface ChatWindowProps {
    message: Chat | null,
    groupActive: boolean,
}



export default function ChatWindow({ message, groupActive }: ChatWindowProps) {
    const chatRef = useRef<HTMLDivElement>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [issueNoteId, setIssueNoteId] = useState<string>("");
    const [issueLoading, setIssueLoading] = useState<boolean>(false);
    const { mutate } = usePostIssueMessage();
    const { data: issuePickData, isSuccess: pickSuccess } = useQuery({
        ...issuePickableQuery(issueNoteId),
        enabled: !!issueNoteId
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userDetail } = useContext(UserDetailContext);
    const [msgDetail, setMsgDetail] = useState<IIssueInterface>({
        id: "",
        sender: "",
        groupName: "",
        senderName: "",
        message: "",
        noteId: "",
        postTime: 0,
        isIssue: false,
        activeStatus: false,
        divisionId: ""
    })

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [message?.messages]);


    const handleSkip = (noteId: string, action: string) => {
        mutate({
            noteId: noteId,
            userId: userDetail.data.result.divisionId,
            action: action
        });
    }

    const handleClick = (item: IIssueInterface) => {
        setIssueNoteId(item.noteId);
        setIssueLoading(true);
        setMsgDetail(item);
    }

    useEffect(() => {
        if (pickSuccess && issuePickData) {
            setTimeout(() => {
                setIssueNoteId("");
                setIssueLoading(false);
                onOpen();
            }, 1200);
        } else {
            setIssueLoading(false);
        }
    }, [pickSuccess]);


    if (issueLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            </div>
        )
    }



    return (
        <>
            {
                <div className="flex-1 flex flex-col w-[70%] md:w-[65%] lg:w-[75%]">
                    {
                        !groupActive && message == null ?
                            <div className="relative flex h-full items-center justify-center overflow-hidden group">
                                <img
                                    src="/chatbg.jpg"
                                    alt="Chat background"
                                    className="absolute inset-0 w-full h-full object-contain opacity-20"
                                />

                                <p
                                    className=" user-select-none cursor-none
                                    relative z-10 max-w-md px-6 text-center text-base font-medium text-gray-800
                                    transition-transform duration-300 ease-out
                                    group-hover:-translate-y-2
                                    "
                                >
                                    “Every message you resolve is a step toward solving a real problem.
                                    Stay focused, stay kind — your work has the power to change lives.”
                                </p>
                            </div>
                            :
                            <>
                                <div className="flex justify-between items-center gap-3 p-4 py-2 bg-green-600 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center">
                                            {message?.groupName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{message?.groupName}</p>
                                            <p className="text-xs text-green-100">online</p>
                                        </div>
                                    </div>
                                    <div className="flex w-[30vw] h-9 items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                        <Search size={13} className="text-gray-500" />
                                        <input
                                            type="search"
                                            onChange={(e) => setSearchText(e.target.value)}
                                            placeholder="Search chats"
                                            className="bg-transparent outline-none h-6 text-black text-sm py-1 w-full"
                                        />
                                    </div>
                                </div>

                                <div
                                    ref={chatRef}
                                    className="flex flex-col-reverse overflow-y-auto p-6 bg-gray-200 gap-4"
                                >
                                    {message?.messages.filter(issue => searchText ? issue.message.toLowerCase().includes(searchText.toLowerCase()) : issue).map((msg) => (
                                        <div key={msg.id} className="flex justify-end">
                                            <div
                                                className="group relative max-w-[75%] hover:border-2 hover:border-green-500 rounded-xl  bg-white px-4 py-3 text-sm shadow-sm border  border-gray-200 transition hover:shadow-md">
                                                {/* Message text */}
                                                <div className="underline underline-offset-1">
                                                    {msg.senderName}
                                                </div>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {msg.message}
                                                </p>

                                                {/* Time */}
                                                <p className="mt-1 text-[12px] text-right text-gray-900">
                                                    {getCutomTimeStampToTime(msg.postTime)}
                                                </p>

                                                {/* Actions */}
                                                <div className=" mt-2 flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleClick(msg)}
                                                        size="sm"
                                                        className="!bg-green-500 hover:!bg-green-600 text-white"
                                                    >
                                                        Pickup
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleSkip(msg.noteId, 'skip')}
                                                        size="sm"
                                                        className="!bg-red-500 hover:!bg-red-600 text-white"
                                                    >
                                                        Skip
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </>
                    }




                    {/* Input is blocked as in this no one is allowed to chat */}
                    {/* Input */}
                    {/* <div className="flex items-center gap-2 p-3 border-t bg-white">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message"
                        className="flex-1 rounded-full border px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                    >
                        <Send size={18} />
                    </button>
                </div> */}
                </div>
            }

            {
                isOpen && <IssueCreateNewModel

                    isOpen={isOpen} onClose={onClose}
                    item={msgDetail}
                />
            }
        </>
    )
}