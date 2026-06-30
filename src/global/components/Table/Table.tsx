

interface TableInterface {
 children:any
}

const Table: React.FC<TableInterface> = ({children}) => {
  return (
    <div className="relative overflow-x-auto rounded">
      <table className="w-full text-sm text-left rtl:text-right text-gray-200 border-2 border-gray-400 rounded">
        {children}
      </table>
    </div>
  );
};

export default Table;
