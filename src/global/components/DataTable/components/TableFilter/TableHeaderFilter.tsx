import { Column } from "@tanstack/react-table"
import { DebounceInput } from "./DebounceInput";




interface TableHeaderProps{
    column:Column<any, unknown>;
}



const TableHeaderFilter:React.FC<TableHeaderProps> = ({column}) => {

    const columnFilterValue = column.getFilterValue();
    const {filterVariant} = column.columnDef.meta ?? {};


  return (
    <div>
      {
        filterVariant === "range" ?
        (
          <div className="flex space-x-2">
            <DebounceInput
            type="number"
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value=> column.setFilterValue((old:[number,number])=> [value, old?.[1]])}
            placeholder={"Min"}
            className="w-12 outline-none border text-black shadow rounded"
            />
            <DebounceInput
            type="number"
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={value=> column.setFilterValue((old:[number,number])=> [old?.[0], value])}
            placeholder={"Max"}
            className="w-12 outline-none text-black border shadow rounded"
            />
          </div>
        )
        :
        filterVariant  === "number" ?

        <DebounceInput
        className="px-2 py-1 w-40 outline-none rounded-md text-black"
        value={(columnFilterValue ?? '') as string}
        onChange={(value: any)=> column.setFilterValue(value)}
        placeholder="Search"
        type="text"
      />
      :
      ''
      }
 
    </div>
  )
}

export default TableHeaderFilter
