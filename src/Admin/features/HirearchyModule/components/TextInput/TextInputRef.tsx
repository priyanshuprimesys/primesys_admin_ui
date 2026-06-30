


interface TextRefProps {
    Type: string;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    placeHolder?: string;
    width?: string;
    labelName: string;
    padding?: string;
    className?: string;
}




const TextInputRef: React.FC<TextRefProps> = ({ Type, inputRef, width, className, placeHolder, padding, labelName }) => {

    const handleInputRef = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputRef && inputRef.current) {
            inputRef.current.value = e.target.value.trimStart().trimEnd();
        }
    }


    return (
        <div className="flex flex-col">
            <label className="text-xs font-bold" htmlFor={`input_${labelName}`}>
                {labelName}
            </label>
            <input
                id={`input_${labelName}`}
                ref={inputRef}
                placeholder={placeHolder ? placeHolder : 'Enter Text'}
                type={Type ? Type : 'text'}
                onChange={handleInputRef}
                className={`${width ? width : 'w-64'} ${padding ? padding : 'py-2 px-2'} ${className} placeholder:text-xss  border-2 border-gray-400 rounded outline-none focus:border-gray-800`} />
        </div>
    )
}

export default TextInputRef
