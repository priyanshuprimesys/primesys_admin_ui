import { createContext } from "react";



interface IsRememberProps{
    isRemember:boolean;
    SetIsRemember: React.Dispatch<React.SetStateAction<boolean>>
}


const defaultValue:IsRememberProps ={
    isRemember:false,
    SetIsRemember:() =>{}
}



export const IsRememberContext = createContext(defaultValue);