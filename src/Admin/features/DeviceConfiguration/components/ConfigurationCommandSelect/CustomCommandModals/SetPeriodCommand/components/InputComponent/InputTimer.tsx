import { ChangeEvent, useState } from "react";


interface TimerProps {
    placeHolder: string;
    setTimeInput:(time:string) => void;
    timeInput:string
}




const InputTimer: React.FC<TimerProps> = ({ placeHolder,setTimeInput,timeInput }) => {

    const [error,setError] = useState<boolean>(false);


    const handleTimeInput = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.value == ''){
            setError(true);
        }
        else{
            setTimeInput(e.target.value);
            setError(false);
        }
    }

    const handleError = () =>{
        if(timeInput == ''){
            setError(true);
        }
        else{
            setError(false);
        }
    }


    return (
        <>
            <input
                type="time"
                onChange={(e)=>handleTimeInput(e)}
                onClick={handleError}
                value={timeInput}
                placeholder={placeHolder ? placeHolder : 'Enter Text'} id={placeHolder}
                className={`
                    px-1
                    py-2 
                    border-b-2 
                    outline-none 
                    cursor-pointer 
                    min-w-56
                    transition-all
                    duration-200
                    ease-in
                    ${error ? 'border-red-600':'border-gray-700 focus:border-gray-950'}
                    `}
                required />

        </>
    )
}

export default InputTimer
