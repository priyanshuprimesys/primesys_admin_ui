import { Select } from '@chakra-ui/react'


interface ChakraUISelectInterface{
    data:any[];
    Label:string;
    Value:string;
    placeHolder:string;
    setSelectValue:(text:string) => void;
    className?:string;
}


interface selectBoxData{
    label:string;
    value:string;
}


const ChakraUISelectBox: React.FC<ChakraUISelectInterface> = ({data,Label,Value,placeHolder,setSelectValue,className}) => {

    const selectData:selectBoxData[]=[
        ...data.map((val)=>({
            label:val[Label],
            value:val[Value]
        })),
    ];




  return (
    <Select borderColor={'black'} className={`outline-none w-full ${className}`} onChange={(e)=> setSelectValue(e.target.value)} placeholder={placeHolder}>
    {
        selectData.map((item,index)=>(
            <option key={index} value={item.value}>{item.label}</option>
        ))
    }
  </Select>
  )
}

export default ChakraUISelectBox
