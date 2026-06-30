

interface TextInputProps{
    placeHolder:string;
    Type?:string;
    onChangeText:(text:string)=>void;
    textValue:string;
    w?:string;
    className?:string;
}


const TextInput: React.FC<TextInputProps> = ({placeHolder,Type,textValue,onChangeText,w,className}) => {
  return (
    <div className="mt-2">
      <input 
      type={Type ? Type :"text"}
      value={textValue}
      onChange={(e)=>onChangeText(e.target.value)}
      className={`${w ?  w : 'w-64'} px-1 py-2 ${className ? className :'border-2 border-gray-400 rounded'}  outline-none focus:border-gray-800`}
      id={`text_input${placeHolder}`}
      placeholder={placeHolder ? placeHolder : "Text..."} />
    </div>
  )
}

export default TextInput
