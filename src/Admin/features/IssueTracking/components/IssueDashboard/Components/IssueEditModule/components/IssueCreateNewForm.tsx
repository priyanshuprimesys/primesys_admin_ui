import { Field, Form, Formik } from "formik"
import { CreateIssueHook } from "../hooks/CreateIssueHook";
import { formatDateTimeLocalIST } from "./IssueForm";
import { UserDetailContext } from "../../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { IssueStatusEnum, PriorityEnum } from "../../../../../interfaces/IssueForm";
import { IIssueInterface } from "../../../../../interfaces/DeviceIssueInterface";
import ImageUploader from "./ImageUploader";
import { dateToTimestamp } from "../../../../../../../../utils/hooks/dateToTimestamp/dateToTimestamp";
import { Button } from "@chakra-ui/react";
import { ICommentInterface } from "../Interface/IssueCreateInterface";
import { useQueryClient } from "@tanstack/react-query";
import { get_issue_data_by_id_query_key, get_issue_message_query_key } from "../../../../../queryKey/queryKey";
import { IIssueCategoriesInterface } from "../Interface/IssueCategoriesInterface";
import { CgClose } from "react-icons/cg";
import { GetIssueCategories } from "../hooks/GetIssueCategoriesHook";


interface IssueCreateFormInterface {
    data?: IIssueInterface;
    onClose: () => void;
    divisionId: string;
    deviceImei: number;
}







export const IssueCreateNewForm: React.FC<IssueCreateFormInterface> = ({ data, onClose, divisionId, deviceImei }) => {

    const { userDetail } = useContext(UserDetailContext);
    const [fileUrl, setFileUrl] = useState<string>("");
    const { mutate, isPending, data: issueData, isSuccess } = CreateIssueHook();

    const [issueCategories, setIssueCategories] = useState<IIssueCategoriesInterface[]>([]);
    const [categoryType, setCategoryType] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategory, setSubCategory] = useState<string>("");

    const { data: issueCategoryData, isSuccess: issueSuccess } = GetIssueCategories();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const queryClient = useQueryClient();


    useEffect(() => {
        if (issueSuccess) {
            setIssueCategories(issueCategoryData.data.data.result);
        }
    }, [issueData, issueSuccess]);

    useEffect(() => {
        if (isSuccess && issueData.data.success) {
            if (!isPending) {
                queryClient.invalidateQueries({ queryKey: [get_issue_data_by_id_query_key] });
                queryClient.invalidateQueries({ queryKey: [get_issue_message_query_key] });
                onClose();
            }
        }
    }, [isSuccess, issueData]);

    const [issueComment, setIssueComment] = useState<ICommentInterface[]>([]);
    const [commentStr, setCommentStr] = useState<string>("");
    const [fileAttach, setFileAttach] = useState<string[]>([]);

    const handleComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentStr(e.target.value);
        if (e.target.value != "") {
            const issueObj: ICommentInterface = {
                id: "",
                text: commentStr,
                commentedAt: Math.floor(Date.now() / 1000),
                commentedBy: userDetail.data.result.divisionId
            }
            setIssueComment([issueObj]);
        }

    }

    const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value == "" || e.target.value.includes("Select Category")) {
            return;
        }
        setCategoryType(e.target.value);
        const subcategories = issueCategories.filter((x) => x.category.includes(e.target.value));
        setCategories(subcategories[0].subcategories);
    }
    const handleSelectSubCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value == "" || e.target.value.includes("Select Tags")) {
            return;
        }
        setSubCategory(e.target.value);
        let tagsArr: string[] = selectedTags;
        tagsArr.push(e.target.value);
        setSelectedTags(tagsArr);
    }

    const handleDeselectTag = (tag: string) => {
        let issueTags = selectedTags.filter((item) => !item.includes(tag));
        setSelectedTags(issueTags);
    }


    return (
        <div>
            <Formik
                onSubmit={(values, action) => {
                    if (fileUrl != '') {
                        setFileAttach([fileUrl]);
                    }


                    setTimeout(() => {
                        mutate({
                            wMsgId: values.wMsgId,
                            sender: values.sender,
                            groupName: values.groupName,
                            senderName: values.senderName,
                            message: values.message,
                            noteId: values.noteId,
                            postTime: dateToTimestamp(values.postTime),
                            isIssue: values.isIssue,
                            issueStatus: values.issueStatus,
                            priority: values.priority,
                            category: categoryType.length > 1 ? categoryType : '',
                            assignee: values.assignee,
                            assigneeName: userDetail.data.result.userName,
                            comments: issueComment.length > 0 ? issueComment : [],
                            tags: selectedTags.length > 0 ? selectedTags : [],
                            attachments: fileAttach.length > 0 ? fileAttach : [],
                            dueDate: dateToTimestamp(values.dueDate),
                            createdBy: values.createdBy,
                            divisionId: divisionId,
                            deviceImei: deviceImei
                        })
                        action.setSubmitting(false);
                    }, 900);
                }}

                initialValues={{
                    wMsgId: "",
                    sender: `${data?.sender ?? ""}`,
                    groupName: `${data?.groupName ?? ""}`,
                    senderName: `${data?.senderName ?? ""}`,
                    message: `${data?.message ?? ""}`,
                    noteId: `${data?.noteId ?? ""}`,
                    postTime: data ? formatDateTimeLocalIST(Math.floor(data.postTime / 1000)) : formatDateTimeLocalIST(Math.floor(new Date().getTime())),
                    isIssue: true,
                    issueStatus: IssueStatusEnum.OPEN,
                    priority: PriorityEnum.HIGH,
                    category: "",
                    assignee: userDetail.data.result.divisionId,
                    comments: [
                        {
                            id: "",
                            text: "",
                            commentedBy: userDetail.data.result.divisionId,
                            commentedAt: Math.floor(Date.now() / 1000)
                        }
                    ],
                    tags: [""],
                    attachments: [File],
                    dueDate: formatDateTimeLocalIST(Math.floor(new Date().getTime() / 1000 + 86400)),
                    createdBy: userDetail.data.result.divisionId,
                    divisionId: data?.divisionId
                }}
            >
                {() => (
                    <Form className="w-full">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="groupName" className="text-xs font-semibold">
                                    Group Name
                                </label>
                                <Field
                                    type="text"
                                    id="groupName"
                                    name="groupName"
                                    placeholder="Enter Group name"
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="senderName" className="text-xs font-semibold">
                                    Sender Name
                                </label>
                                <Field
                                    type="text"
                                    id="senderName"
                                    name="senderName"
                                    placeholder="Enter Sender name"
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                            <div className="w-full">
                                <label className="block text-sm font-semibold">Categories</label>
                                <Field
                                    as="select"
                                    className="w-full px-3 py-2 border-2 border-black rounded"
                                    value={categoryType}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectCategory(e)}
                                >
                                    <option defaultValue={""}>Select Category</option>
                                    {issueCategories.map((item, index) => (
                                        <option key={index} value={item.category}>
                                            {item.category}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className="w-full">
                                <label htmlFor="priority" className="block text-sm font-semibold">
                                    Tags
                                </label>
                                <Field
                                    as="select"
                                    disabled={categoryType === "" ? true : false}
                                    className="w-full px-3 py-2 border-2 border-black rounded"
                                    value={subcategory}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectSubCategory(e)}
                                >
                                    <option defaultValue={""}>Select Tags</option>
                                    {categories.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                        </div>

                        {selectedTags.length > 0 && (
                            <div className="mt-4 px-3 py-3 bg-gray-200 border border-gray-400 rounded">
                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedTags.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border bg-white gap-2 border-gray-700 w-fit flex items-center text-[13px] px-2 py-1 rounded-full"
                                        >
                                            <h2 className="text-black">{item}</h2>
                                            <CgClose
                                                className="cursor-pointer"
                                                onClick={() => handleDeselectTag(item)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                            <div className="w-full">
                                <label htmlFor="issueStatus" className="block text-sm font-semibold">
                                    Issue Status
                                </label>
                                <Field as="select" name="issueStatus" className="w-full px-3 py-2 border rounded">
                                    <option value={IssueStatusEnum.OPEN}>{IssueStatusEnum.OPEN}</option>
                                    <option value={IssueStatusEnum.INPROGRESS}>
                                        {IssueStatusEnum.INPROGRESS}
                                    </option>
                                    <option value={IssueStatusEnum.UNDEROBSERVATION}>
                                        {IssueStatusEnum.UNDEROBSERVATION}
                                    </option>
                                    <option value={IssueStatusEnum.SOFTCLOSE}>{IssueStatusEnum.SOFTCLOSE}</option>
                                    <option value={IssueStatusEnum.CLOSE}>{IssueStatusEnum.CLOSE}</option>
                                </Field>
                            </div>

                            <div className="w-full">
                                <label htmlFor="priority" className="block text-sm font-semibold">
                                    Priority
                                </label>
                                <Field as="select" name="priority" className="w-full px-3 py-2 border rounded">
                                    <option value={PriorityEnum.HIGH}>{PriorityEnum.HIGH}</option>
                                    <option value={PriorityEnum.MEDIUM}>{PriorityEnum.MEDIUM}</option>
                                    <option value={PriorityEnum.LOW}>{PriorityEnum.LOW}</option>
                                </Field>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-semibold mb-2">Assigned To</label>
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded cursor-not-allowed">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">
                                        {userDetail.data.result.userName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {userDetail.data.result.userName}
                                </span>
                                <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">You</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="postTime" className="text-xs font-semibold">
                                    Picked Time
                                </label>
                                <Field
                                    disabled
                                    type="datetime-local"
                                    id="postTime"
                                    name="postTime"
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="dueDate" className="text-xs font-semibold">
                                    Due Time
                                </label>
                                <Field
                                    type="datetime-local"
                                    id="dueDate"
                                    name="dueDate"
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="message" className="text-xs font-semibold">
                                    Customer Message
                                </label>
                                <Field
                                    as="textarea"
                                    id="message"
                                    name="message"
                                    placeholder="Enter Customer message"
                                    rows={3}
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none resize-none"
                                />
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="comments" className="text-xs font-semibold">
                                    Comment
                                </label>
                                <textarea
                                    value={commentStr}
                                    onChange={(e) => handleComment(e)}
                                    placeholder="Enter your comment"
                                    rows={3}
                                    className="w-full px-3 py-2 border-2 border-black rounded outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <ImageUploader setFileUrl={setFileUrl} />
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
                            <Button onClick={() => onClose()} type="button" colorScheme="red">
                                Cancel
                            </Button>

                            <Button type="submit" colorScheme="green">
                                {isPending ? "Submitting....." : "Submit"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}