import { Field, Form, Formik } from "formik"
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { CgClose } from "react-icons/cg";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { IIssueCategoriesInterface } from "../IssueDashboard/Components/IssueEditModule/Interface/IssueCategoriesInterface";
import { GetIssueCategories } from "../IssueDashboard/Components/IssueEditModule/hooks/GetIssueCategoriesHook";
import { formatDateTimeLocalIST } from "../IssueDashboard/Components/IssueEditModule/components/IssueForm";
import { IssueStatusEnum, PriorityEnum } from "../../interfaces/IssueForm";
import { IIssueEditResponse } from "../IssueDashboard/Components/IssueEditModule/Interface/IssueCommentInterface";
import { LuImport } from "react-icons/lu";


interface IssueCreateFormInterface{
    data?:IIssueEditResponse;
    onClose:() => void;
}







export const AllIssueForm: React.FC<IssueCreateFormInterface> = ({data,onClose}) =>{

    const {userDetail} = useContext(UserDetailContext);

    const [issueCategories,setIssueCategories] = useState<IIssueCategoriesInterface[]>([]);
    const [categoryType,setCategoryType] = useState<string>('');
    // const [categories,setCategories] = useState<string[]>([]);
    // const [subcategory,setSubCategory] = useState<string>("");

    const {data:issueCategoryData,isSuccess:issueSuccess} = GetIssueCategories();

    const [selectedTags,setSelectedTags] = useState<string[]>([]);



    useEffect(()=>{
        if(issueSuccess){
            setIssueCategories(issueCategoryData.data.data.result);
        }
    },[issueSuccess]);

    useEffect(()=>{
        if(data){
            setCategoryType(data.category);
        }
    },[data]);



    const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) =>{
        setCategoryType(e.target.value);
        const subcategories = issueCategories.filter((x) => x.category.includes(e.target.value));
        console.log(subcategories);
        // setCategories(subcategories[0].subcategories);
    }
    // const handleSelectSubCategory = (e: ChangeEvent<HTMLSelectElement>) =>{
    //     // setSubCategory(e.target.value);
    //     let tagsArr:string[] = selectedTags;
    //     tagsArr.push(e.target.value);
    //     setSelectedTags(tagsArr);
    // }

    const handleDeselectTag = (tag:string) =>{
        let issueTags = selectedTags.filter((item)=> !item.includes(tag));
        setSelectedTags(issueTags);
    }


    return(
        <div>
            <Formik
                onSubmit={(_values,action)=>{
                    setTimeout(() => {
                        action.setSubmitting(false);
                    }, 900);
                }}

                initialValues={{
                    wMsgId: "",
                    sender:  `${ data?.sender ?? ""}`,
                    groupName: `${data?.groupName ?? ""}`,
                    senderName: `${data?.senderName ?? ""}`,
                    message: `${data?.message ?? ""}`,
                    noteId: `${data?.noteId ?? ""}`,
                    postTime: data ? formatDateTimeLocalIST(Math.floor(data.postTime / 1000)) :  formatDateTimeLocalIST(Math.floor(new Date().getTime())),
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
                {()=>(
                    <Form>
                        <div className="flex justify-between gap-2">
                            <div className="flex flex-col w-full gap-2">
                                <label
                                    htmlFor="groupName"
                                    className="text-xs font-semibold"
                                >
                                    Group Name
                                </label>
                                <Field
                                    type="text"
                                    id="groupName"
                                    disabled={true}
                                    name="groupName"
                                    placeholder="Enter Group name"
                                    className="px-2 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <label
                                    htmlFor="senderName"
                                    className="text-xs font-semibold"
                                >
                                    Sender Name
                                </label>
                                <Field
                                    type="text"
                                    id="senderName"
                                    disabled={true}
                                    name="senderName"
                                    placeholder="Enter Sender name"
                                    className="px-2 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                        </div>
                            <div className="flex w-full gap-2 my-2">
                                <div className="w-full">
                                    <label className="block text-sm font-semibold">
                                        Categories
                                    </label>
                                        
                                        <Field
                                            as="select"
                                            disabled={true}
                                            className="w-full px-2 py-2 border-2 border-black rounded"
                                            value={categoryType}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>)=> handleSelectCategory(e)}
                                        >
                                            <option defaultValue={""}>Select Category</option>
                                            {
                                            issueCategories.map((item,index)=>(
                                                <option key={index} value={item.category}>{item.category}</option>
                                            ))
                                            }
                                        </Field>
                                </div>
        
                                {/* <div className="w-full">
                                    <label htmlFor="priority" className="block text-sm font-semibold">
                                        Tags
                                    </label>
                                    <Field
                                        as="select"
                                        disabled={true}
                                        className="w-full px-2 py-2 border-2 border-black rounded"
                                        value={subcategory}
                                        onChange={(e:ChangeEvent<HTMLSelectElement>) => handleSelectSubCategory(e)}
                                    >
                                        <option defaultValue={""}>Select Tags</option>
                                        {
                                            categories.map((item,index)=>(
                                                <option key={index} value={item}>{item}</option>
                                            ))
                                        }
                                    </Field>
                                </div> */}
                            </div>
                            <h1 className="my-2 font-bold">Tags</h1>
                            <div className='flex flex-wrap items-center gap-2 overflow-auto overflow-x-scroll'>
                                
                                {
                                    data?.tags.map((item,index)=>(
                                        <div key={index} className='border-[1px] text-[14px] bg-white gap-2 border-gray-700 w-fit flex items-center  px-2 rounded'>
                                            <h2 className='text-black'>{item}</h2>
                                        </div>
                                    ))
                                }
                            </div>
                        {
                            selectedTags.length > 0 &&
                            <div className='px-2 py-2 bg-gray-200 border-gray-500 rounded mb-7'>
                                {
                                    selectedTags.length ==0 ? 
                                    (
                                        <p className='text-[12px] font-light text-gray-900'>
                                            Select Tags
                                        </p>
                                    )
                                    :
                                    (
                                        <div className='flex items-center gap-2'>
                                            {
                                                selectedTags.map((item,index)=>(
                                                    <div key={index} className='border-[1px] bg-white gap-2 border-gray-700 w-fit flex items-center text-[13px] px-2 rounded'>
                                                        <h2 className='text-black'>{item}</h2>
                                                        <CgClose className='cursor-pointer' onClick={()=> handleDeselectTag(item)} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        }

                        <div className="flex w-full gap-2 my-2">
                            <div className="w-full">
                                <label htmlFor="issueStatus" className="block text-sm font-semibold">
                                    Issue Status
                                </label>
                                    <Field
                                        as="select"
                                        disabled={true}
                                        name="issueStatus"
                                        className="w-full px-2 py-2 border rounded"
                                    >
                                        <option value={IssueStatusEnum.OPEN}>{IssueStatusEnum.OPEN}</option>
                                        <option value={IssueStatusEnum.INPROGRESS}>{IssueStatusEnum.INPROGRESS}</option>
                                        <option value={IssueStatusEnum.UNDEROBSERVATION}>{IssueStatusEnum.UNDEROBSERVATION}</option>
                                        <option value={IssueStatusEnum.SOFTCLOSE}>{IssueStatusEnum.SOFTCLOSE}</option>
                                        <option value={IssueStatusEnum.CLOSE}>{IssueStatusEnum.CLOSE}</option>
                                    </Field>
                            </div>
    
                            <div className="w-full">
                                <label htmlFor="priority" className="block text-sm font-semibold">
                                    Priority
                                </label>
                                <Field
                                    as="select"
                                    disabled={true}
                                    name="priority"
                                    className="w-full px-2 py-2 border rounded"
                                >
                                    <option value={PriorityEnum.HIGH}>{PriorityEnum.HIGH}</option>
                                    <option value={PriorityEnum.MEDIUM}>{PriorityEnum.MEDIUM}</option>
                                    <option value={PriorityEnum.LOW}>{PriorityEnum.LOW}</option>
                                </Field>
                            </div>
                        </div>
                        <div className="flex gap-2 my-2">
                            <div className="flex flex-col w-full gap-2">
                                <label
                                    htmlFor="postTime"
                                    className="text-xs font-semibold"
                                >
                                    Picked Time
                                </label>
                                <Field
                                    disabled
                                    type="datetime-local"
                                    id="postTime"
                                    name="postTime"
                                    className="px-2 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <label
                                    htmlFor="dueDate"
                                    className="text-xs font-semibold"
                                >
                                    Due Time
                                </label>
                                <Field
                                    type="datetime-local"
                                    disabled={true}
                                    id="dueDate"
                                    name="dueDate"
                                    className="px-2 py-2 border-2 border-black rounded outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col w-full gap-2">
                                <label htmlFor="message" className="text-xs font-semibold">Customer Message</label>
                                <Field
                                    as="textarea"
                                    disabled={true}
                                    id="message"
                                    name="message"
                                    placeholder="Enter Customer message"
                                    rows={2}
                                    className="px-2 py-2 border-2 border-black rounded outline-none resize-none"
                                />
                            </div>
                        </div>
                        <div className="my-3">
                            <h3 className="mb-3 font-semibold">
                                Comments
                            </h3>
                            {
                                data?.comments.map((item,index)=>(
                                    <h2 key={index}>
                                        {++index}{'. '}{item.text}
                                    </h2>
                                ))
                            }
                        </div>

                        <div className='flex flex-col items-start justify-start mt-6'>
                            <h1 className='font-semibold'>Attachements</h1>
                            {
                                data?.attachments.filter(x => x != '').map((item,index)=>(
                                    <a key={index} download className="flex py-1 items-center gap-2 border-b-[1px] border-gray-400 hover:shadow-md px-1 justify-end text-blue-700 underline underline-offset-1" href={`http://64.227.176.22/${item}`}>
                                        {item}
                                        <LuImport size={17} color='black' />
                                    </a>
                                ))
                            }
                        </div>
                        <div className="flex justify-end gap-4 mt-3">
                            <Button onClick={()=> onClose()} type="button" colorScheme="red">
                                Cancel
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}