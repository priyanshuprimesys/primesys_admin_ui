import { useState } from "react";



interface InputValueProps {
    placeHolder: string;
    defaultValue: string;
    type?: string;
    className: string;
    setInputState: (text: string) => void;
    fieldName?: string;
    labelName?: string;
}





const InputValueBox: React.FC<InputValueProps> = ({ placeHolder, defaultValue, type, className, setInputState, fieldName, labelName }) => {

    const [inputValue, setInputValue] = useState<string>(defaultValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setInputState(event.target.value);
    }


    return (
        <div className="flex flex-col">
            <label className="px-2 text-sm font-semibold" htmlFor={`input_${placeHolder}`}>{labelName}</label>
            <input
                type={type ? type : "text"}
                id={`input_${placeHolder}`}
                value={inputValue ?? ''}
                className={className}
                name={fieldName}
                onChange={handleChange} />
        </div>
    )
}





export { InputValueBox };