



interface SelectProps {
  selectOption: any[] | undefined;
  selectValue: string;
  selectName: string;
  selectOptionBracket?: string;
  defaultOptionName?:string;
  setSelectValue:(value:string) => void;
}





const SelectInput: React.FC<SelectProps> = ({ selectOption, selectValue, selectName, selectOptionBracket,setSelectValue,defaultOptionName }) => {
  return (
    <div className="mt-2">
      <select
      onChange={(e)=>setSelectValue(e.target.value)}
        className="bg-gray-50 border  text-gray-900 focus:border-gray-900 border-gray-400 text-sm rounded-lg outline-none block w-full p-2.5"
      >
        <option value="">{defaultOptionName}</option>
        {
          selectOption ?
            selectOption?.map((item, index) => (
              <option key={index} value={item[selectValue]}>
               {`${item[selectName]}`} {`${selectOptionBracket ? `${item[selectOptionBracket]}` : ''}`}
              </option>
            ))
            :
            <option>No Data Available</option>
        }
      </select>
    </div>
  )
}

export default SelectInput
