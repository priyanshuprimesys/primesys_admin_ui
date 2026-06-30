import '../../styles/SetTimerCss.css'



interface InputBoxProps{
    placeHolder:string;
    timerInput:string;
    setTimerInput:(time:string) => void;
}



const InputBox: React.FC<InputBoxProps> = ({placeHolder,timerInput,setTimerInput}) => {
  return (
    <>
      <input 
      type="number"
      value={timerInput}
      onChange={(e)=>setTimerInput(e.target.value)}
      placeholder={placeHolder}
      required
      className="bg-gray-50 border-b-2 mb-4 border-gray-800 text-gray-900 text-sm rounded-lg outline-none block w-full p-2.5"  />
    </>
  )
}

export default InputBox
