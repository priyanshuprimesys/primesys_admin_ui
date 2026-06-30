

interface CustomProps{
    className:string;
    placeHolder:string;
    labelName?:string;
    type?:string;
    labelClass?:string;
    customWidth?:string;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;

}





const CustomInputBoxRef: React.FC<CustomProps> = ({
    placeHolder,
    className,
    labelName,
    type,
    labelClass,
    customWidth,
    inputRef
}) =>{

    const handleInputRef = (event: React.ChangeEvent<HTMLInputElement>) =>{
        event.preventDefault();
        if(inputRef && inputRef.current){
            inputRef.current.value = event.target.value.trimStart().trimEnd();
        }
    }


    return(
        <div className={`flex flex-col w-full ${customWidth}`}>
            <label htmlFor={`input_${placeHolder}`} className={labelClass} >{labelName}</label>
            <input 
            ref={inputRef}
            className={className}
            type={type ? type :"text"} 
            id={`input_${placeHolder}`}
            onChange={handleInputRef}
            placeholder={placeHolder}
            required />
        </div>
    )
}



export default CustomInputBoxRef;
