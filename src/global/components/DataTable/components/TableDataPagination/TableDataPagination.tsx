import { Table } from "@tanstack/react-table";
import { IconComponents } from "../../../../Icons/IconsStore";



interface TableDataProps{
    table:Table<any>;
}



const TableDataPagination: React.FC<TableDataProps> = ({table}) => {
  return (
    <div className="flex items-center gap-4">
      <p className="gap-4 font-semibold">
        Showing {table.getState().pagination.pageIndex + 1} of {" "} {table.getPageCount()}
      </p>
      <div className="inline-flex items-center mt-2">
        <button onClick={
            () => table.previousPage()
        }
        disabled={
            !table.getCanPreviousPage()
        }
        className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
        >
            {IconComponents.backwradIcon}
            <p className="m-0">Prev</p>
        </button>

        <button onClick={
            () => table.nextPage()
        }
        disabled={
            !table.getCanNextPage()
        }
        className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-gray-800 border-0 border-gray-700 border-s rounded-e hover:bg-gray-900"
        >
            {IconComponents.forwardIcon}
            <p className="m-0">Next</p>
        </button>
      </div>
    </div>
  )
}

export default TableDataPagination
