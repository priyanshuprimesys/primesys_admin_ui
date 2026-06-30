import { useContext } from "react";
import { TableContext } from "../context/TableContext";

interface TableBodyInterface{
    data:any[];
    bodyClassName?:string;
}



const TableBody: React.FC<TableBodyInterface> = ({data,bodyClassName}) =>{

    const {tableHeadCount} = useContext(TableContext);


    return(
        <>
        <tbody className={`${bodyClassName} bg-white    `}>
          {data.length > 0 ? (
            <tr className="bg-white border-b text-black text-xs">
          {
              data.map((item, index) => (
                <td key={index} className="px-6 py-4 font-semibold">{item.value}</td>
            ))
          }
            </tr>
           
          ) : (
            <tr  className="py-4 px-6 text-xs font-semibold text-center">
              <td
              colSpan={tableHeadCount}
                className="text-black font-semibold text-xs py-4"
              >
                Data not available
              </td>
            </tr>
          )}
        </tbody></>
    )
}


export default TableBody;