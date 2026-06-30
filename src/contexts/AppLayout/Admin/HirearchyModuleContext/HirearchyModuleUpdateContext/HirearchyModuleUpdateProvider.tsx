import { useRef, useState } from "react"
import { HirearchyModuleUpdateContext } from "./HirearchyModuleUpdateContext"
import { HirearchyUpdateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyEditInitialState/HirearchyUpdateInitialState";
import { IHirearchyUpdateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateInterface";
















export const HirearchyModuleUpdateProvider = ({children}:any) =>{

    const updateDeviceListRef = useRef<string>('');
    const [selectedDeviceList,setSelectedDeviceList] = useState<string>('');
    const updateHirearchyDeviceRef = useRef<IHirearchyUpdateInterface>(HirearchyUpdateInitialState);
    const [clearSelectedDevice,setClearSelectedDevice] = useState<boolean>(false);
    const [allDeviceList,setAllDeviceList] = useState<string>("");

    return(
        <HirearchyModuleUpdateContext.Provider value={{
             updateDeviceListRef,selectedDeviceList,setSelectedDeviceList,updateHirearchyDeviceRef,
             clearSelectedDevice,setClearSelectedDevice,
             allDeviceList,setAllDeviceList
              }}>
            {children}
        </HirearchyModuleUpdateContext.Provider>
    )
}