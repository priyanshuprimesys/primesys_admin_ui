import { ChangeEvent } from "react";


interface StudentCheckProps {
    lableName: string;
    labelClass?: string;
    inputClass?: string;
    OnFilterCheck:(event: ChangeEvent<HTMLInputElement>) => void;
    name:string;
    value:string;
    isChecked:boolean;
}



const StudentDevicesFilterCheck: React.FC<StudentCheckProps> = ({ lableName,isChecked, labelClass, inputClass,OnFilterCheck,name,value }) => {
    return (
        <div>
            <label className={labelClass} htmlFor={`input_${lableName}`}>
                <input 
                onChange={OnFilterCheck}
                type="radio"
                name={name}
                value={value}
                checked={isChecked}
                className={inputClass} />

                {lableName}
            </label>
        </div>
    )
}

export default StudentDevicesFilterCheck
