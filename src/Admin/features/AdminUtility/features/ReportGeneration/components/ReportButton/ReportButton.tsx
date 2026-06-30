import { Button } from "@chakra-ui/react";



interface ButtonInterface{
    onHandleClick:() => void
    disable?:boolean;
}



const ReportButton:React.FC<ButtonInterface> = ({onHandleClick,disable}) =>{
    
    return(
        <Button disabled={disable} onClick={onHandleClick} className="overflow-hidden px-4 w-full !bg-primary !text-white">
            Submit
        </Button>
    )
}




export default ReportButton;