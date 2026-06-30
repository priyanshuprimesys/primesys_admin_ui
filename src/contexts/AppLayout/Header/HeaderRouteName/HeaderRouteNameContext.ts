import { createContext } from "react";







interface HeaderRouteProps{
    headerComponentName:string;
    setHeaderComponentName: React.Dispatch<React.SetStateAction<string>>;
}



const HeaderRouteDefault:HeaderRouteProps={
    headerComponentName:'Home',
    setHeaderComponentName:() =>{}
}



export const HeaderRouteNameContext = createContext(HeaderRouteDefault);