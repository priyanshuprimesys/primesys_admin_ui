import { useContext, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableColumnInterface } from "../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import TableFilter from "./components/TableFilter/TableFilter";
import TableRowData from "./components/TableRowData/TableRowData";
import TableDataPagination from "./components/TableDataPagination/TableDataPagination";
import AddButton from "./components/TableAction/AddButton/AddButton";
import TableModal from "./components/TableModal/TableModal";
import { DataTableContext } from "../../../contexts/AppLayout/DataTableContext/DataTableContext";
import Loader from "../loader/Loader";
import TableHeaderFilter from "./components/TableFilter/TableHeaderFilter";

interface DataTableProps {
  columns: DataTableColumnInterface<any>[];
  data?: any[];
  dataIsScuccess?: boolean;
  isLoading?: boolean;
  onTableAction?: boolean;
  btnName?: string;
  modalName?: string;
  modalComponent?: any;
  bodyClassName?: string;
  headerClassName?: string;
  filterSuccess?: boolean;
  filterComponent?: any;
  tableHeadCss?: string;
  tableBodyCss?: string;
  tableCss?: string;
  hideColumn?: string;
  tableHeaderColumn?: string;
  additionalHeader?: boolean;
  additionHeaderComponent?: any[];
  headerFilter?: boolean;
  tdRowColor?: string;
  tdColorOne?: string
  tdColorTwo?: string,
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  btnName,
  onTableAction,
  modalName,
  modalComponent,
  bodyClassName,
  headerClassName,
  hideColumn,
  tableHeadCss,
  tableBodyCss,
  tableCss,
  tableHeaderColumn,
  isLoading,
  additionalHeader,
  additionHeaderComponent,
  headerFilter,
  tdRowColor,
}) => {
  const {
    tableModalActive,
    setTableModalActive,
    globalFilter,
    setGlobalFilter,
    setTableInstance,
  } = useContext(DataTableContext);

  const table = useReactTable({
    data: data ? data : [],
    columns: columns,
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  });

  useEffect(() => {
    setGlobalFilter("");
    data = [];
  }, []);

  const onSubmitClick = () => {
    setTableModalActive(true);
  };

  useEffect(() => {
    if (data && data?.length > 1) {
      setTableInstance(
        table.getFilteredRowModel().rows.map((row) => row.original)
      );
    }
  }, [globalFilter, table, data]);

  return (
    <>
      <div
        className={`w-full  bg-gray-100 mt-2 ${data ? "max-h-full" : "max-h-[80vh]"
          } overflow-hidden border-2 border-gray-800 rounded px-2 py-4`}
      >
        <div className="relative h-full overflow-x-auto">
          <div className="flex items-center justify-between">
            <div className="mb-4 w-96">
              <TableFilter
                globalFilter={globalFilter}
                setGlobalFilters={setGlobalFilter}
              />
            </div>
            <div className="flex items-center gap-3 pr-4 mb-3">
              {additionalHeader &&
                additionHeaderComponent?.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              {onTableAction && (
                <AddButton name={btnName} onHandleClick={onSubmitClick} />
              )}
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : data ? (
            data.length !== 0 ? (
              <>
                <table
                  className={`w-full overflow-x-scroll  table-fixed ${tableCss}`}
                >
                  <thead className={`static  ${tableHeadCss}`}>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr className="flex w-full" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            className={`px-2 py-1 whitespace-nowrap ${header.id == tableHeaderColumn
                              ? "hidden"
                              : headerClassName
                              }`}
                            style={{ flex: header.column.columnDef.size ?? 1, minWidth: 0 }}
                            key={header.id}
                          >
                            {header.column.columnDef.header?.toString()}
                            {headerFilter && header.column.getCanFilter() ? (
                              <div>
                                <TableHeaderFilter column={header.column} />
                              </div>
                            ) : null}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className={`${tableBodyCss}`}>
                    {table.getRowModel().rows.map((row) => (
                      <tr className={`flex w-full`} key={row.id}>
                        {row.getVisibleCells().map((cell) => {


                          return (
                            <td
                              className={`overflow-x-hidden align-top ${tdRowColor ? row.original.packetFrom === "server" ? 'bg-[#b4f8c8]' : 'bg-[#fbe7c6]' : ''} text-wrap ${cell.column.id == hideColumn
                                ? "hidden"
                                : `${bodyClassName}`
                                }`}
                              style={{ flex: cell.column.columnDef.size ?? 1, minWidth: 0 }}
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-4 align-middle">
                  <TableDataPagination table={table} />

                  <div className="mt-2">
                    <TableRowData value={table} />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <p className="m-0 text-lg font-bold text-center">
                  No Data Available
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="m-0 text-lg font-bold text-center">
                No Data Available
              </p>
            </div>
          )}
        </div>
      </div>
      {onTableAction && tableModalActive && (
        <TableModal
          setModalActive={setTableModalActive}
          headerName={modalName}
          children={modalComponent}
        />
      )}
    </>
  );
};

export default DataTable;
