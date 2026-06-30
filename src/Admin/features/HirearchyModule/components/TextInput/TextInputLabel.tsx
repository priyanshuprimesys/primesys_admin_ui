


interface LabelProps{
    placeHolder?:string;
    textValue:string;
    setTextValue:(text:string)=> void;
    type:string;
    width?:string;
    labelName:string;
    padding?:string;
    className?:string;
}




const TextInputLabel: React.FC<LabelProps> = ({placeHolder,textValue,setTextValue,type,width,labelName,padding,className}) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold" htmlFor={`input_${labelName}`}>
        {labelName}
      </label>
      <input 
      id={`input_${labelName}`}
      type={type ? type : "text"}
      value={textValue}
      onChange={(e)=>setTextValue(e.target.value)}
      placeholder={placeHolder ? placeHolder : "Enter here...."}
      className={`${width ?  width : 'w-64'} ${padding ?  padding : 'py-2 px-2'} ${className} placeholder:text-xss  border-2 border-gray-400 rounded outline-none focus:border-gray-800`} />
    </div>
  )
}

export default TextInputLabel;
