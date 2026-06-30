import { createContext } from "react";




interface TestProps{
    userText:string;
    setUserText: React.Dispatch<React.SetStateAction<string>>;
}




const TestdefaultValue:TestProps ={
    userText:'tt',
    setUserText:() => {}
}



export const TestContext = createContext(TestdefaultValue);