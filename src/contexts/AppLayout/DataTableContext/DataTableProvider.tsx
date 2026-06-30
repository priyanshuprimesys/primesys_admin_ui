import { useState } from "react"
import { DataTableContext } from "./DataTableContext"









export const DataTableProvider = ({children}:any) =>{

    const [tableModalActive,setTableModalActive] = useState<boolean>(false);
    const [globalFilter,setGlobalFilter] = useState<string>("");
    const [tableInstance,setTableInstance] = useState<any[] | null>(null);

    return(
        <DataTableContext.Provider value={{ 
            tableModalActive,setTableModalActive,
            globalFilter,setGlobalFilter,
            tableInstance,setTableInstance
            }}>
            {children}
        </DataTableContext.Provider>
    )
}