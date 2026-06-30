import { useState } from "react"
import { TableContext } from "./TableContext"

export const TableProvider = ({children}:any) => {
    const [tableHeadCount,setTableHeadCount] = useState<number>(0);
  return (
    <TableContext.Provider value={{
        tableHeadCount,setTableHeadCount
    }}>
        {children}
    </TableContext.Provider>
  )
}
