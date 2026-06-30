import { createContext } from "react";



interface TableInterface{
    tableHeadCount:number;
    setTableHeadCount: React.Dispatch<React.SetStateAction<number>>;
}

const TableData:TableInterface={
    tableHeadCount:0,
    setTableHeadCount:() => {}
}


export const TableContext = createContext(TableData);