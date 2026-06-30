import { Field, Form, Formik } from 'formik';
import {  IssueStatusEnum, PriorityEnum } from '../../../../../interfaces/IssueForm';
import { Button } from '@chakra-ui/react';
import { ICommentRequest, IIssueEditResponse, IUpdateCommentRequest } from '../Interface/IssueCommentInterface';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { ICommentInterface } from '../Interface/IssueCreateInterface';
import { TiTick } from "react-icons/ti";
import { UserDetailContext } from '../../../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext';
import { UpdateComment } from '../hooks/UpdateCommentHook';
import ImageUploader from './ImageUploader';
import { UpdateIssueHook } from '../hooks/UpdateIssueHook';
import { dateToTimestamp } from '../../../../../../../../utils/hooks/dateToTimestamp/dateToTimestamp';
import { toast } from 'react-toastify';
import { LuImport } from "react-icons/lu";
import { BiMinus, BiPlus } from 'react-icons/bi';
import { EditCommentUpdateHook } from '../hooks/EditCommentUpdateHook';
import { GetIssueCategories } from '../hooks/GetIssueCategoriesHook';
import { IIssueCategoriesInterface } from '../Interface/IssueCategoriesInterface';
import { CgClose } from 'react-icons/cg';
import { useQueryClient } from '@tanstack/react-query';


export const formatDateTimeLocalIST = (timestamp: number): string => {
    
  const date = String(timestamp).length > 10 ?  new Date(timestamp) : new Date(timestamp * 1000);

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};


interface IssueFormInterface{
    issueEditData: IIssueEditResponse;
    onClose:() => void;
}

const IssueForm: React.FC<IssueFormInterface> = ({issueEditData,onClose}) =>{


    const [issueCategories,setIssueCategories] = useState<IIssueCategoriesInterface[]>([]);
    const [categoryType,setCategoryType] = useState<string>('');
    const [categories,setCategories] = useState<string[]>([]);
    const [subcategory,setSubCategory] = useState<string>("");

    const [selectedTags,setSelectedTags] = useState<string[]>([]);


    const {userDetail} = useContext(UserDetailContext);
    const [addComment,setAddComment] = useState<boolean>(false);
    const [fileUrl,setFileUrl] = useState<string>("");
    const [fileAttach,setFileAttach] = useState<string[]>([]);
    const {mutate} = UpdateComment();
    const {mutate:issueUpdate,isSuccess} = UpdateIssueHook();
    const {mutate:issueCommentEdit} = EditCommentUpdateHook();
    const {data,isSuccess:issueSuccess} = GetIssueCategories();

    const queryClient = useQueryClient();


    const [issueComment,setIssueComment] = useState<ICommentInterface[]>([{
        id:"",
        text:"",
        commentedAt:0,
        commentedBy:""
    }]);

    const [updateEditComment,setUpdateEditComment] = useState<IUpdateCommentRequest>({
        issueId: "",
        commentId:"",
        updatedText:  "",
        updatedBy: "",
    })
    const issueCommnetText = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        if(issueSuccess){
            setIssueCategories(data.data.data.result);
        }
    },[data,issueSuccess]);

    useEffect(()=>{
        if(issueEditData){
            setIssueComment(issueEditData.comments);
            setCategoryType(issueEditData.category);
            setCategories(issueEditData.tags);
            setSelectedTags(issueEditData.tags);
            setFileAttach(issueEditData.attachments);
        }
    },[issueEditData]);


    useEffect(()=>{
        if(isSuccess){
            queryClient.invalidateQueries({queryKey:["get-dashboard-analytics-all"]})
            onClose();
        }
    },[isSuccess]);

    const handleSubmitComment = () =>{
        if(addComment){
            if(issueCommnetText.current?.value == ""){
                toast.error("Additional comment Cannot be empty");
                return;
            }

            let commnetObj: ICommentRequest = {
                issueId: issueEditData.id,
                text: issueCommnetText.current ? issueCommnetText.current?.value : "",
                commentedAt: Math.floor(new Date().getTime() / 1000),
                commentedBy: userDetail.data.result.divisionId
            };
            let arrComment: ICommentInterface = {
                id: commnetObj.issueId,
                text: commnetObj.text,
                commentedAt: commnetObj.commentedAt,
                commentedBy: commnetObj.commentedBy
            } 
            let newComment: ICommentInterface[] = issueComment;
            newComment.push(arrComment);
            setIssueComment(newComment);
            if(issueCommnetText.current){
                issueCommnetText.current.value = "";
            }
            mutate(commnetObj);
            return;
        }else if(!addComment){
            const filterEmptyComment = issueComment.filter((x)=> x.text.length < 1).length;
            if(filterEmptyComment > 0){
                toast.error("Comment Cannot be empty");
                return;
            }
            issueCommentEdit(updateEditComment);

        }
    }



    const handleCommentEdit = (e:ChangeEvent<HTMLInputElement>,id:string) =>{
        const issueCommentText = issueComment.map(comment => comment.id == id ? {...comment,text: e.target.value}: comment);
        const filterText = issueCommentText.filter(comment => comment.id == id);
        let newObject:IUpdateCommentRequest = {
            issueId: issueEditData.id,
            commentId: id,
            updatedText: filterText[0].text,
            updatedBy: userDetail.data.result.divisionId
        }
        setUpdateEditComment(newObject);
        setIssueComment(issueCommentText);
    }

    const handleRemoveComment = () =>{
        setAddComment(false);
    }

    const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) =>{
        if(e.target.value == "" || e.target.value.includes("Select Category")){
            return;
        }
        setCategoryType(e.target.value);
        const subcategories = issueCategories.filter((x) => x.category.includes(e.target.value));
        setCategories(subcategories[0].subcategories);
        setSubCategory("");
    }
    const handleSelectSubCategory = (e: ChangeEvent<HTMLSelectElement>) =>{
        if(e.target.value == "" || e.target.value.includes("Select Tags")){
            return;
        }
        setSubCategory(e.target.value);
        let tagsArr:string[] = selectedTags;
        tagsArr.push(e.target.value);
        setSelectedTags(tagsArr);
    }

    const handleDeselectTag = (tag:string) =>{
        let issueTags = selectedTags.filter((item)=> !item.includes(tag));
        setSelectedTags(issueTags);
    }


    return(
        <div>
            <Formik
                onSubmit={(values,action)=>{
                    const newFileArray: string[] = fileAttach; 
                    
                    newFileArray.push(fileUrl);


                    setTimeout(() => {
                        issueUpdate({
                        issueId: issueEditData.id,
                        updatedBy: userDetail.data.result.divisionId,
                        issue: {
                            wMsgId: values.wMsgId,
                            sender: issueEditData.sender,
                            groupName: values.groupName,
                            senderName: values.senderName,
                            message: values.message,
                            noteId: issueEditData.noteId,
                            postTime: issueEditData.postTime,
                            isIssue: issueEditData.isIssue,
                            issueStatus: values.issueStatus,
                            priority: values.priority,
                            category: categoryType.length > 1 ? categoryType : '',
                            assignee: issueEditData.assignee,
                            previousAssignee: issueEditData.previousAssignee,
                            comments: [],
                            tags: selectedTags.length > 0 ? selectedTags : [],
                            attachments: newFileArray,
                            dueDate: dateToTimestamp(values.dueDate),
                            reopenCount: issueEditData.reopenCount,
                            statusHistory: [],
                            transferHistory: [],
                            activeStatus: issueEditData.activeStatus,
                            actionBy: userDetail.data.result.divisionId,
                            divisionId: issueEditData.divisionId
                        }
                        })
                        action.setSubmitting(false);
                    }, 800);
                }}
                
                initialValues={{
                    wMsgId: "",
                    groupName: issueEditData.groupName,
                    senderName:issueEditData.senderName,
                    message: issueEditData.message,
                    noteId: issueEditData.noteId,
                    postTime:formatDateTimeLocalIST(Math.floor(issueEditData.postTime)),
                    isIssue: issueEditData.isIssue,
                    assignee: issueEditData.assignee,
                    issueStatus: issueEditData.issueStatus,
                    priority: issueEditData.priority,
                    category: issueEditData.category,
                    createdBy: issueEditData.createdBy,
                    dueDate:formatDateTimeLocalIST(Math.floor(issueEditData.dueDate)),
                    tags: [issueEditData.tags],
                }}
            >
                {({values})=>(
                    <Form>
                        <div className="flex gap-2">
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
                                    name="senderName"
                                    placeholder="Enter Sender name"
                                    className="px-2 py-2 border-2 border-black rounded outline-none"
                                />
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
                                    id="dueDate"
                                    name="dueDate"
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
    
                            <div className="w-full">
                                <label htmlFor="priority" className="block text-sm font-semibold">
                                    Tags
                                </label>
                                <Field
                                    as="select"
                                    disabled={categoryType == "" ? true :false}
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
                            </div>
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
                                        <div className='flex flex-wrap items-center gap-2 overflow-auto overflow-x-scroll'>
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
                                        name="issueStatus"
                                        className="w-full px-2 py-2 border-2 border-black rounded"
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
                                    name="priority"
                                    className="w-full px-2 py-2 border-2 border-black rounded"
                                >
                                    <option value={PriorityEnum.HIGH}>{PriorityEnum.HIGH}</option>
                                    <option value={PriorityEnum.MEDIUM}>{PriorityEnum.MEDIUM}</option>
                                    <option value={PriorityEnum.LOW}>{PriorityEnum.LOW}</option>
                                </Field>
                            </div>
                        </div>
                                    
                        <div className='w-full mt-4'>
                             <div className='flex items-center justify-between mb-3'>
                                    <h1 className='mb-3 text-base font-semibold'>Comment</h1>
                                    <div className='flex items-center justify-end w-full gap-8'>
                                        <button onClick={()=> setAddComment(true)} type='button' className='px-1 py-1 rounded-full border-[1px] border-gray-500'>
                                            <BiPlus size={24} className='cursor-pointer text-primary'/>
                                        </button>
                                        {/* <div  onClick={()=> handleSubmitComment()} className={`px-1 py-1 cursor-pointer border-2 border-green-500 rounded-full`} >
                                            <TiTick size={24} className={'text-green-600'} />
                                        </div> */}
                                    </div>
                                    
                                </div>
                            
                            <div className='flex items-center w-full gap-3'>
                                <div className='w-full'>
                                   
                                    {
                                        issueComment.map((item,index)=>(
                                            <div key={index} className="flex items-center w-full gap-2 mb-2">
                                                <input 
                                                    type="text"
                                                    value={item.text}
                                                    onChange={(e)=> handleCommentEdit(e,item.id)}
                                                    id={item.id} 
                                                    className="w-full px-2 py-2 border-[1px] border-black rounded outline-none"
                                                />
                                                <div  onClick={()=> handleSubmitComment()} className={`px-1 py-1 cursor-pointer border-2 border-green-500 rounded-full`} >
                                                    <TiTick size={24} className={'text-green-600'} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                               
                            </div>
                            
                            {
                                addComment && (
                                    <div className='flex items-center w-full gap-3'>
                                        <div className='w-full mt-4'>
                                            <div className="w-full">
                                                <textarea
                                                    ref={issueCommnetText}
                                                    placeholder="Enter your comment"
                                                    rows={2}
                                                    className="w-full px-2 py-2 border-2 border-black rounded outline-none"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={()=> handleRemoveComment()} type='button' className='px-1 py-1 rounded-full border-[1px] border-gray-500'>
                                            <BiMinus size={24} className='cursor-pointer text-primary'/>
                                        </button>
                                        <div  onClick={()=> handleSubmitComment()} className={`px-1 py-1 cursor-pointer border-2 border-green-500 rounded-full`} >
                                            <TiTick size={24} className={'text-green-600'} />
                                        </div>
                                    </div>
                                    
                                )
                            }
                      
                           
                        </div>
                        
                        <div className='flex flex-col items-start justify-start mt-6'>
                            <h1 className='font-semibold'>Attachements</h1>
                            {
                                issueEditData?.attachments.filter(x => x != '').map((item,index)=>(
                                    <a key={index} download className="flex py-1 items-center gap-2 border-b-[1px] border-gray-400 hover:shadow-md px-1 justify-end text-blue-700 underline underline-offset-1" href={`http://64.227.176.22/${item}`}>
                                        {item}
                                        <LuImport size={17} color='black' />
                                    </a>
                                ))
                            }
                        </div>
                        <div>
                            <ImageUploader setFileUrl={setFileUrl}/>
                        </div>

                        <div className="flex flex-col mt-4">
                            <label htmlFor="message" className="text-xs font-semibold">Customer Message</label>
                            <Field type="text" value={values.message}
                                id="message" name='message'
                                className="px-2 py-2 border-2 border-black rounded outline-none"/>
                        </div>

                        <div className="flex justify-end gap-4 mt-3">
                            <Button type="submit" colorScheme="green">
                                Submit
                            </Button>
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

export default IssueForm;