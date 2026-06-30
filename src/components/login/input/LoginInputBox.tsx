import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";



interface loginInputProps {
    labelName: string;
    inputType: string;
    inputState?: React.MutableRefObject<HTMLInputElement | null>;
}




const LoginInputBox: React.FC<loginInputProps> = ({ labelName, inputType, inputState }) => {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const iconSize = 19;
    const iconColor = '#f3f4f6';

    const handleInputRef = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputState && inputState.current) {
            inputState.current.value = e.target.value.trimStart().trimEnd();
        }
    }


    return (
        <div className="relative z-0 mb-8">
            <span>
                {
                    inputType === "password" ?
                        <span className="cursor-pointer absolute right-0 top-0">
                            {
                                isVisible ?
                                    <FaEyeSlash size={iconSize} color={iconColor} onClick={() => setIsVisible(false)} />
                                    :
                                    <FaEye size={iconSize} color={iconColor} onClick={() => setIsVisible(true)} />
                            }
                        </span>
                        :
                        <div>

                        </div>
                }
            </span>
            <input ref={inputState} onChange={handleInputRef} type={inputType ? inputType === "password" ? isVisible ? "text" : "password" : inputType : 'text'} id={labelName} className="w-full text-gray-300 peer border-b-2 border-b-gray-400 focus:border-b-border-lightBorder duration-300 ease-in outline-none placeholder-transparent px-1 bg-transparent text-sm" placeholder={labelName} autoComplete="new-password" />
            <label htmlFor={labelName} className="text-xs absolute left-0 bg-transparent -top-5 peer-placeholder-shown:text-sm cursor-text peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-placeholder-shown:left-1 text-white transition-all">{labelName}</label>
        </div>
    )
}



export default LoginInputBox;