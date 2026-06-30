

interface GlobalProps{
    labelName?:string;
    placeHolder:string;
    className?:string;
    setInputText:(text:string) => void;
    type?:string;
}




const GlobalInputBox: React.FC<GlobalProps> = ({
    labelName,placeHolder,className,setInputText,type
}) =>{
    return(
        <div>
            <label htmlFor={`${labelName}_label`}>{labelName}</label>
            <input 
            type={type ? type : "text"} 
            id={`${labelName}_label`}
            className={className}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeHolder} />
        </div>
    )
}


export default GlobalInputBox;