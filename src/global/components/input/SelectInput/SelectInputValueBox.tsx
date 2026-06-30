import { useState } from "react";




interface SelectProps {
  selectOption: any[] | undefined;
  selectValue: string;
  selectName: string;
  selectOptionBracket?: string;
  setSelectValue: (value: string) => void;
  defaultValue: number | string;
  labelName?:string;
}





const SelectInputValueBox: React.FC<SelectProps> = ({ selectOption, selectValue, selectName, selectOptionBracket, setSelectValue, defaultValue,labelName }) => {

  const [selectedValue, setSelectedValue] = useState<number | string>(defaultValue ? defaultValue :'');


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectValue(value);
    setSelectedValue(value);
  }



  return (
    <div className="mt-2">

      <label className="px-2 text-sm font-semibold" htmlFor={`input_${selectValue}`}>{labelName}</label>


      <select
        value={selectedValue}
        onChange={handleChange}
        className="bg-gray-50 border  text-gray-900 focus:border-gray-900 border-gray-400 text-sm rounded-lg outline-none block w-full p-2.5"
      >
        <option value="">Select Option</option>
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

export default SelectInputValueBox;
