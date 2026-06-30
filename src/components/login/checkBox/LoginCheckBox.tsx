import {useContext } from "react";
import { IsRememberContext } from "../../../contexts/AuthLayout/IsRememberContext/IsRememberContext";


interface checkBoxLoginProps {
    name: string;
}




const LoginCheckBox: React.FC<checkBoxLoginProps> = ({ name }) => {


    const {isRemember,SetIsRemember}  = useContext(IsRememberContext);

    const onSelectChecked = () => {
        if (isRemember) {
            SetIsRemember(false);
        }
        else {
            SetIsRemember(true);
        }
    }



    return (
        <>
            <div className="gap-2 flex text-sm">
                <input type="checkbox" className="text-primary rounded w-4" checked={isRemember} onChange={onSelectChecked} id={name} />
                <label htmlFor={name} className={isRemember ? `text-gray-200` : `text-gray-400`}>{name}</label>
            </div>
        </>
    )
}




export default LoginCheckBox;