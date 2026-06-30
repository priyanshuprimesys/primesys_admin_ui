import { createContext } from "react";


interface SubSidebarContextType{
    sideIcon:string;
    setSideIcon: React.Dispatch<React.SetStateAction<string>>;
    sidebarExpand: boolean;
    setSidebarExpand: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultValueContext: SubSidebarContextType ={
    sideIcon: 'true',
    setSideIcon: () => {},
    sidebarExpand: false,
    setSidebarExpand: () =>{}
}


const SubSidebarContext = createContext<SubSidebarContextType>(defaultValueContext);




export default SubSidebarContext;