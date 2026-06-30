import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useOutsideClickHandler } from "../../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler";
import InputSearchCss from '../../../styles/module/InputSearchParentCss..module.css'
import { DeviceExchangeParentContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeParentContext/DeviceExchangeParentContext";
import { DeviceDetailContext } from "../../../../../../contexts/AppLayout/DeviceDetailContext/DeviceDetailContext";
import { DeviceExchangeStudentContext } from "../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext";
import { useErrorNotification } from "../../../../../../utils/hooks/notification/useErrorNotification";

interface InputStudentProps{
    placeHolder:string;
    setStudentDeviceId:(deviceId:string)=> void;
    setStudentDeviceName:(deviceName:string)=> void;
}





const InputWithSearchStudent: React.FC<InputStudentProps> = ({placeHolder,setStudentDeviceId,setStudentDeviceName}) => {

    const [searchInput, setSearchInput] = useState<string>('');
    const [listActive,setListActive] = useState<boolean>(false);
    const {ref,isComponentVisible,SetIsComponentVisible} = useOutsideClickHandler<HTMLDivElement>(listActive);
    const {isDeviceParentIdValid} = useContext(DeviceExchangeParentContext);
    const {filteredDeviceList} = useContext(DeviceDetailContext);
    const {studentDeviceOne} = useContext(DeviceExchangeStudentContext);

    useEffect(()=>{
        if(searchInput){
            SetIsComponentVisible(true);
        }else{
            SetIsComponentVisible(false);
        }
    },[searchInput,SetIsComponentVisible]);

    useEffect(()=>{
        if(studentDeviceOne == ''){
            setSearchInput('');
        }
    },[studentDeviceOne]);


    const filteredData = searchInput ?  filteredDeviceList?.data.result.filter((x: { name: string; }) => x.name.toLowerCase().includes(searchInput.toLowerCase())) : filteredDeviceList?.data?.result;
    
    const handleParentId = () =>{
        if(isDeviceParentIdValid == false){
            useErrorNotification('Select a valid Parent Name');
        }
    }

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) =>{
        setSearchInput(e.target.value);
        if(e.target.value == '')
        {
            setStudentDeviceId('');
            setStudentDeviceName('');
        }
    }


    const handleClickStudent = (deviceId:string,name:string,imeiNo:number) =>{
        setListActive(true);
        setStudentDeviceId(deviceId);
        setStudentDeviceName(name);
        setSearchInput(`${name} (${imeiNo})`);
    }



  return (
    <div className="relative z-30 w-full">
        <input type="search" 
        id={`search-student ${placeHolder}`}
        placeholder={placeHolder}
        value={searchInput}
        onChange={(e)=> handleSearchInput(e)}
        onClick={handleParentId}
        className={`block w-full p-2 text-sm text-black border-b-2 outline-none ${isDeviceParentIdValid ? 'focus:border-dark' : 'focus:border-red-600'} border-gray-400 rounded-sm  bg-gray-50 `}
        required
        autoComplete="off" />

        {
            isComponentVisible  &&(
                <div ref={ref} className={`w-full z-30 absolute py-2 max-h-64 bg-gray-200 px-2 ${InputSearchCss.searchListContainer}`}>
                    <ul>
                        {
                            filteredData?.length != 0 && isDeviceParentIdValid  ?

                            filteredData?.map((item,index)=>(
                                <li key={index} className="py-1.5 gap-2 flex text-sm border-b-2 border-gray-300 text-wrap cursor-pointer" onClick={()=> handleClickStudent(item.deviceId,item.name,item.imeiNo)}>
                                   <span>{item.name}</span>
                                   <span>({item.imeiNo})</span>
                                </li>
                            ))
                            :
                            <p className="m-0 text-xs font-normal text-center">Data Not Found</p>
                        }
                    </ul>
                </div>
            )
        }
    </div>
  )
}

export default InputWithSearchStudent;
