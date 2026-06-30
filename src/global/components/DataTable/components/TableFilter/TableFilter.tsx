import { useEffect, useState } from "react";
import { IconComponents } from "../../../../Icons/IconsStore";

interface TableFilterProps {
  globalFilter: string;
  setGlobalFilters: (filter: string) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({
  globalFilter,
  setGlobalFilters,
}) => {
  const [filterText, setFilterText] = useState(globalFilter);

  useEffect(() => {
    setFilterText(globalFilter);
  }, [globalFilter]);

  const onFilterChange = (value: string) => {
    setFilterText(value);
    setGlobalFilters(value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
        {IconComponents.searchIcon}
      </div>
      <input
        type="search"
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        id={"default_search_table"}
        placeholder="Search here.."
        className="block w-full py-1.5 px-2 text-sm text-gray-900 transition-all duration-200 ease-out border-2 border-gray-800 rounded-3xl ps-10 bg-gray-50 outline-none"
      />
    </div>
  );
};

export default TableFilter;
