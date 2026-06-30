


interface GlobalInputProps{
    inputRef: React.MutableRefObject<HTMLInputElement | null>
    placeHolder:string;
    type?:string;
    className:string;
    errorMessage?:string;
}




const GlobalInputRef: React.FC<GlobalInputProps> = ({
    placeHolder,type,inputRef,className,errorMessage
}) => {

    const handleInputRef = (e: React.ChangeEvent<HTMLInputElement>) => {
        errorMessage = '';
        if(inputRef && inputRef.current)
        {
            inputRef.current.value = e.target.value;
        }
    }


  return (
    <div className="flex flex-col mt-2">
        <input
        ref={inputRef}
        type={type ? type : "text"}
        id={`text_input_${placeHolder}`}
        className={className}
        placeholder={placeHolder}
        onChange={handleInputRef} required />
        {
            errorMessage ?
            <div className="pl-2 font-light text-red-600 text-error">
                {errorMessage}
            </div>
            :
            ''
        }
    </div>
  )
}

export default GlobalInputRef
