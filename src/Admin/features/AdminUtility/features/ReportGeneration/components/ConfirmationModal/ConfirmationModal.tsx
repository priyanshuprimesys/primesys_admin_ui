import { Button, CircularProgress } from "@chakra-ui/react";
import ChakraUiModal from "../../../../../../../global/components/Modals/components/ChakraUiModal";
import { IconComponents } from "../../../../../../../global/Icons/IconsStore";
import { IReportGenerateResponseInterface } from "../../interfaces/IReportGenerateResponse";
import { ReportStatus } from "../../util/ReportStatusType";
import OtpInputBox from "../OtpInputBox/OtpInputBox";
import { IOtpVerifyResponseInterface } from "../../interfaces/IOtpVerifyResponseInterface";

interface ModelInterface{
    isOpen:boolean;
    onClose:()=> void;
    onSubmitAction:()=> void;
    parentName:string,
    reportDate:Date | null;
    isPending:boolean;
    data:IReportGenerateResponseInterface;
    reportStatus:string;
    setOtpOne:(text:string)=> void;
    setOtpTwo:(text:string)=> void;
    setOtpThree:(text:string)=> void;
    setOtpFour:(text:string)=> void;
    setOtpFive:(text:string)=> void;
    setOtpSix:(text:string)=> void;
    onHandleVerify:()=> void;
    errorMessage:string | undefined | null;
    otpData:IOtpVerifyResponseInterface;
    onHandleCloseModal:()=>void
}




const ConfirmationModal: React.FC<ModelInterface> = ({
    isOpen,onClose,onSubmitAction,parentName,reportDate,isPending,data,reportStatus,
    setOtpOne,setOtpTwo,setOtpThree,setOtpFour,setOtpFive,setOtpSix,onHandleVerify,otpData,
    errorMessage,onHandleCloseModal
}) =>{




    return(
        <ChakraUiModal
        isOpen={isOpen}
        onClose={onHandleCloseModal}
        modalSize="xl"
        modalHeader="Confirm Report Generation"
        >

            {
                reportStatus === ReportStatus.allDivision ?
                <>
                {
                    isPending ?
                        <div className="flex flex-col items-center justify-center">
                            <CircularProgress isIndeterminate color="blue.600" />
                            <div className="mt-3">
                                <p>Report Generation is in progress...</p>
                            </div>
                        </div>
                    :
                    <>
                        <OtpInputBox
                            setOtpFive={setOtpFive}
                            setOtpFour={setOtpFour}
                            setOtpOne={setOtpOne}
                            setOtpSix={setOtpSix}
                            setOtpThree={setOtpThree}
                            setOtpTwo={setOtpTwo}
                            onHandleClick={onHandleVerify}
                        />
                        {
                            otpData.success === true ?
                            <div className="flex justify-end gap-6 mt-6">
                                <Button className="!bg-red-600 !px-8 !text-white" onClick={onClose}>Close</Button>
                                <Button className="!border-2 border-green-600 !bg-white !px-8" onClick={onSubmitAction}>Submit</Button>
                            </div>
                            :
                            <div className="mt-4 text-center">
                                {
                                    otpData.success === false ? <span className="text-red-600">{otpData.data.result}</span> : <span className="text-green-600">{otpData.data.result}</span>
                                }
                            </div>
                        }
                    </>
                }

                </>
                :
                <>
                {


                    isPending ?

                        <div className="flex justify-center">
                            <CircularProgress isIndeterminate color="blue.600" />
                        </div>
                    :

                    data.data && data.data.result.length > 1
                    ?
                    <>

                        <ul>
                            {
                                data.data.result.slice(1,-1).split('\\n').map((item,index)=>(
                                    <li key={index} className="font-medium">{item}</li>
                                ))
                            }   
                        </ul>
                        <p className="mt-4 text-lg text-green-600">Success</p>
                        <div className="flex justify-end">
                            <Button onClick={onHandleCloseModal} className="!bg-red-600 !text-white">Close</Button>
                        </div>
                    </>
                    :
                        errorMessage && errorMessage.length > 1 ?
                    <div>
                        <p className="text-red-600">{errorMessage}</p>
                    </div>
                    :
                    <div>
                        <div className="mb-4">
                            <h1 className="text-lg text-center">Do you want to generate <b className="text-yellow-500">Report?</b></h1>
                        </div>
                        <div className="mb-4 ">
                            <h3 className="text-base font-bold">Report Info:</h3>
                            <div className="ml-3">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">Division Name:</h4>
                                    <span className="text-lg font-bold underline underline-offset-1">{parentName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">Report Date:</h4>
                                    <span className="text-lg font-bold underline underline-offset-1">{reportDate ? new Date(reportDate).toLocaleDateString([],{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div>
                                {IconComponents.errorIcon}
                            </div>
                            <div>
                                <p>By <b>clicking</b> on submit you will confirm to generate report. Please read <b>Note</b> below before submitting</p>
                                <p>Do not Close this modal! Wait till the report is generated</p>
                            </div>
                        </div>
                        <div>
                            <b>Note:</b>
                            <div>
                                <p className="font-light">This action will delete the previous record and will generate a new record.</p>
                                <p className="font-light">The action will be irreversible. Once report <b className="font-bold">generated</b></p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-6 mt-6">
                            <Button className="!bg-red-600 !px-8 !text-white" onClick={onClose}>Close</Button>
                            <Button className="!border-2 border-green-600 !bg-white !px-8" onClick={onSubmitAction}>Submit</Button>
                        </div>
                    </div>
                
            }
                </>
            }

            
          
        </ChakraUiModal>
    )
}


export default ConfirmationModal;