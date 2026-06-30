import { createContext, MutableRefObject } from "react";






interface DeviceFamilyNumberProps{
    familyNumberOneRef: MutableRefObject<HTMLInputElement | null>;
    familyNumberTwoRef: MutableRefObject<HTMLInputElement | null>;
    familyNumberThreeRef: MutableRefObject<HTMLInputElement | null>;
}


const familyNumberdefaultValue:DeviceFamilyNumberProps ={
    familyNumberOneRef:{current:null},
    familyNumberTwoRef:{current:null},
    familyNumberThreeRef:{current:null}
}


export const DeviceFamilyNumberCommandContext = createContext(familyNumberdefaultValue);