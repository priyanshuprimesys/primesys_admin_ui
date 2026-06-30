import { useState } from "react";
import SubSidebarContext from "./SubSideBarContext";


const SubSideBarContextProvider = ({children}: any) =>{
    const [sideIcon, setSideIcon] = useState<string>('false');
    const [sidebarExpand,setSidebarExpand] = useState<boolean>(false);
    return(
        <SubSidebarContext.Provider value={{ sideIcon: sideIcon, setSideIcon: setSideIcon, sidebarExpand,setSidebarExpand }}>
            {children}
        </SubSidebarContext.Provider>
    )
}



export default SubSideBarContextProvider;