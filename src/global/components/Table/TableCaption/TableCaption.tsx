const TableCaption = ({children}:any) =>{
    return(
        <caption className="p-5 border-t-2 border-l-2 border-r-2 border-gray-600 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
            {children}
        </caption>
    )
}


export default TableCaption;