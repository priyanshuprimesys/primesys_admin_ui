import { Button, HStack, PinInput, PinInputField } from "@chakra-ui/react";

interface OtpInterface{
    setOtpOne:(text:string)=> void;
    setOtpTwo:(text:string)=> void;
    setOtpThree:(text:string)=> void;
    setOtpFour:(text:string)=> void;
    setOtpFive:(text:string)=> void;
    setOtpSix:(text:string)=> void;
    onHandleClick:()=> void
}





const OtpInputBox: React.FC<OtpInterface> = ({
setOtpFive,setOtpFour,setOtpOne,setOtpSix,setOtpThree,setOtpTwo,
onHandleClick
}) =>{
    


    

    return(
        <div className="flex justify-center items-center flex-col">
            <div className="mb-2">
                <h1>Verify OTP</h1>
            </div>
            <HStack className="flex">
                <PinInput otp>
                    <PinInputField onChange={(e)=> setOtpOne(e.target.value)} />
                    <PinInputField onChange={(e)=> setOtpTwo(e.target.value)} />
                    <PinInputField onChange={(e)=> setOtpThree(e.target.value)} />
                    <PinInputField onChange={(e)=> setOtpFour(e.target.value)} />
                    <PinInputField onChange={(e)=> setOtpFive(e.target.value)} />
                    <PinInputField onChange={(e)=> setOtpSix(e.target.value)} />
                </PinInput>
            </HStack>
            <div className="mt-4">
                <Button onClick={onHandleClick} className="!bg-white border-2 border-green-600">Verify</Button>
            </div>
        </div>
    )
}



export default OtpInputBox;