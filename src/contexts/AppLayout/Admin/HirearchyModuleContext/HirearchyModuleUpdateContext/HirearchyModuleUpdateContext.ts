import { createContext, MutableRefObject } from "react";
import { IHirearchyUpdateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateInterface";
import { HirearchyUpdateInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyEditInitialState/HirearchyUpdateInitialState";





interface EditProps{
    updateDeviceListRef:MutableRefObject<string>;
    selectedDeviceList:string;
    updateHirearchyDeviceRef: MutableRefObject<IHirearchyUpdateInterface>
    setSelectedDeviceList: React.Dispatch<React.SetStateAction<string>>;
    clearSelectedDevice:boolean;
    setClearSelectedDevice: React.Dispatch<React.SetStateAction<boolean>>;
    allDeviceList:string;
    setAllDeviceList: React.Dispatch<React.SetStateAction<string>>;
}



const defautlEditValue:EditProps ={
    updateDeviceListRef:{current:''},
    selectedDeviceList:'',
    updateHirearchyDeviceRef:{current:HirearchyUpdateInitialState},
    setSelectedDeviceList:() =>{},
    clearSelectedDevice:false,
    setClearSelectedDevice:()=> {},
    allDeviceList:"",
    setAllDeviceList:()=> {}
}



export const HirearchyModuleUpdateContext = createContext(defautlEditValue);