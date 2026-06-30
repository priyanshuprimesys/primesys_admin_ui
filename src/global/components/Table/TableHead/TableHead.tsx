import { useContext, useEffect } from "react";
import { TableContext } from "../context/TableContext";

interface TableHeadInterface{
    tableHead:Array<string>;
    headClassName?:string;
}




const TableHead: React.FC<TableHeadInterface> = ({tableHead,headClassName}) => {


    const {setTableHeadCount} = useContext(TableContext);

    useEffect(()=>{
        setTableHeadCount(tableHead.length);
    },[setTableHeadCount, tableHead]);

  return (
    <>
        <thead
          className={`text-xs text-gray-100 font-semibold bg-primary ${headClassName}`}
        >
          <tr>
            {tableHead.map((thead, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {thead}
              </th>
            ))}
          </tr>
        </thead></>
  )
}




export default TableHead;