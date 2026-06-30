import { useContext, useEffect, useState } from "react";
import { IssueContext } from "../../context/IssueContext/IssueContext";
import { Button, useDisclosure } from "@chakra-ui/react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { usePostIssueMessage } from "../../hooks/postIssueMessage";
import { getMilliToDateTIme } from "../../../../../utils/hooks/timeStampToDate/getMilliToDateTime";
import { IIssueInterface } from "../../interfaces/DeviceIssueInterface";
import { IssueCreateNewModel } from "../IssueDashboard/Components/IssueEditModule/components/IssueCreateNewModel";

const DivisionIssues = () => {
  const { issueHeader,issueMessageData } = useContext(IssueContext);
  const [userAction,setUserAction] = useState<string>("");
  const {mutate,isSuccess,data} = usePostIssueMessage()
  const {userDetail} = useContext(UserDetailContext);
  const {isOpen,onOpen,onClose} = useDisclosure();
  const [msgDetail,setMsgDetail] = useState<IIssueInterface>({
    id: "",
    sender:"",
    groupName: "",
    senderName: "",
    message: "",
    noteId: "",
    postTime: 0,
    isIssue: false,
    activeStatus: false,
    divisionId:""
  })
  


  const messages = issueMessageData.flat(Infinity).filter((item) =>
    item.groupName.toLowerCase().includes(issueHeader.toLowerCase())
  ).sort((a,b) => b.postTime - a.postTime);

  const handleClick = (item: IIssueInterface,action?:string)=>{
    setMsgDetail(item);
    if(!action) return;
    setUserAction(action);
    mutate({
      noteId:item.noteId,
      userId:userDetail.data.result.divisionId,
      action:action
    });
  }
  

  const handleSkip = (noteId:string,action:string) =>{
    setUserAction(action);
    mutate({
      noteId:noteId,
      userId:userDetail.data.result.divisionId,
      action:action
    });
  }

  useEffect(()=>{
    if(isSuccess && data.data.success == true && userAction == "pickup"){
      setTimeout(() => {
        onOpen();
      }, 1400);
    }
  },[isSuccess,userAction]);



  return (
      <>
        <div className={`flex relative bg-gray-300 w-full h-full px-4 py-4 max-h-[90vh]`}>
          <div className={`mt-12 px-4 pt-2 w-full scrollbarContainer ${issueHeader !== ""? "flex flex-col-reverse text-left": "flex justify-center items-center"}`}>
            {issueHeader !== "" ? (
              messages
              .map((item, index) => (
                <div  key={index} className="flex justify-between w-full px-6 py-2 mb-4 text-left bg-gray-100 border border-r-4 border-black rounded cursor-default">
                  <div>
                    <input type="checkbox" name="" id="" className="w-4 h-4 cursor-pointer" />
                    </div>
                  <div className="flex items-center justify-end gap-6">
                  
                    <div className="px-4 border-r-2 border-gray-7 00">
                      <div className="flex items-center justify-end gap-4 text-right">
                        <h2 className="text-xs font-semibold underline underline-offset-2">{item.senderName}</h2>
                        <h3 className="text-xs font-medium underline underline-offset-2">{getMilliToDateTIme(item.postTime)}</h3>
                      </div>
                      <div className="flex justify-end">
                        <p>{item.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={()=> handleClick(item,'pickup')} colorScheme="green">Pickup</Button>
                      <Button onClick={()=> handleSkip(item.noteId,'skip')} colorScheme="red">Skip</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-[70vw] !h-[70vh] flex items-center justify-center">
                <p>Select Division to show Issue</p>
              </div>
            )}
          </div>
        </div>

        {
          isOpen && <IssueCreateNewModel 
            
          isOpen={isOpen} onClose={onClose} 
          item={msgDetail}
           />
        }
      </>
  );
};

export default DivisionIssues;
