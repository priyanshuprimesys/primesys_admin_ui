import { createContext } from "react";







interface DataTableProps{
    tableModalActive:boolean;
    setTableModalActive:React.Dispatch<React.SetStateAction<boolean>>;
    globalFilter:string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
    tableInstance:any[]|null
    setTableInstance: React.Dispatch<React.SetStateAction<any[] | null>>;
}


const defaultDataTableValue:DataTableProps ={
    tableModalActive:false,
    setTableModalActive:() => {},
    globalFilter:'',
    setGlobalFilter:() => {},
    tableInstance:null,
    setTableInstance:()=>{}
}


export const DataTableContext = createContext(defaultDataTableValue);