import { InputSearchListData } from "./components/Input_Search_List_Data";



interface InputDataList{
    placeHolder:string;
}



const InputSearchDataList: React.FC<InputDataList> = ({placeHolder}) => {

    const deviceData =[
        {
            id:1,
            name:'Primesys',
            roll:89
        },
        {
            id:2,
            name:'priyensh',
            roll:89
        },
        {
            id:3,
            name:'priyensh',
            roll:89
        },
        {
            id:4,
            name:'priyensh',
            roll:89
        },
        {
            id:5,
            name:'priyensh',
            roll:89
        },
        {
            id:6,
            name:'priyensh',
            roll:89
        },
        {
            id:7,
            name:'priyensh',
            roll:89
        },
        {
            id:8,
            name:'priyensh',
            roll:89
        },
        {
            id:9,
            name:'priyensh',
            roll:89
        },
        {
            id:10,
            name:'priyensh',
            roll:89
        },
    ]





  return (
   <InputSearchListData 
   placeHolder={placeHolder ? placeHolder : 'Search...'} 
   data={deviceData}
   dataProp={'name'}/>
  )
}

export default InputSearchDataList;
