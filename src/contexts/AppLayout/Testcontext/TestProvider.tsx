import { useState } from "react"
import { TestContext } from "./TestContext"











export const TestProvider = ({children}:any) =>{

    const [userText,setUserText] = useState<string>('tt');

    return(
        <>
        <TestContext.Provider value={{ userText,setUserText }}>
            {children}
        </TestContext.Provider>
        </>
    )
}