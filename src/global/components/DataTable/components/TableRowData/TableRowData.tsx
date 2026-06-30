import { Table } from "@tanstack/table-core";
import { useEffect, useState } from "react";


interface TableDataProps{
    value?: Table<any>;
}


const TableRowData:React.FC<TableDataProps> = ({value}) => {

  const pageArray:any[] = [10,15,20,25,30,35,50,70,85,100];
  const [initialPageSize,setInitialPageSize] = useState<number>(10);

  useEffect(()=>{
    const updatePageArray = () =>{
      const width = window.innerWidth;

      if(width < 640)
      {
        setInitialPageSize(10);
      }else if(width < 1200){
        setInitialPageSize(10);
      }else if(width < 1400)
      {
        setInitialPageSize(20);
      }else if(width > 1600){
        setInitialPageSize(25);
      }
    }

    updatePageArray();

    window.addEventListener("resize",updatePageArray);

    return()=>{
      window.removeEventListener("resize",updatePageArray);
    }
  },[]);


  useEffect(()=>{
    if(value){
      value.setPageSize(initialPageSize);
    }
  },[value,initialPageSize]);


  return (
    <div>
      <select
      className="block w-full h-8 p-1 text-sm text-gray-900 border border-gray-300 rounded-lg outline-none bg-gray-50"
      value={value?.getState().pagination.pageSize}
      onChange={e=>{
        value?.setPageSize(Number(e.target.value))
      }}
      >
{
    pageArray.map(pageSize=>(
        <option key={pageSize} value={pageSize}>
            {pageSize}
        </option>
    ))
}
      </select>
    </div>
  )
}

export default TableRowData
