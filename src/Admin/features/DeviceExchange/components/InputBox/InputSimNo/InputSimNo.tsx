


interface SimNoProps{
    placeHolder:string;
}



const InputSimNo: React.FC<SimNoProps> = ({placeHolder}) => {
  return (
    <>
        <input 
        type="text" 
        id={`search-${placeHolder}`}
        placeholder={placeHolder}
        className="" /> 
    </>
  )
}

export default InputSimNo;
