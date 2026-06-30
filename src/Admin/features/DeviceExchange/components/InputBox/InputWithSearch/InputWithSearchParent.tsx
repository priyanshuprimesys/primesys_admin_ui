import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { TrackUserDetailInterface } from '../../../../../../interfaces/AppInterfaces/TrackUserInterface/TrackUserDetailInterface';
import InputSearchCss from '../../../styles/module/InputSearchParentCss..module.css';
import { useOutsideClickHandler } from '../../../../../../utils/hooks/outSideClickHandler/useOutsideClickHandler';
import { DeviceExchangeParentContext } from '../../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeParentContext/DeviceExchangeParentContext';


interface InputSearchProps {
  placeHolder: string;
  trackUserData: TrackUserDetailInterface | undefined;
  setDivisionId:(divisionId:string) => void;
}




const InputWithSearchParent: React.FC<InputSearchProps> = ({ placeHolder, trackUserData,setDivisionId }) => {

  const [searchInput, setSearchInput] = useState<string>('');
  const [listActive,setListActive] = useState<boolean>(false);
  const {ref,isComponentVisible,SetIsComponentVisible} = useOutsideClickHandler<HTMLDivElement>(listActive);
  const {setIsDeviceParentIdValid,setParentDeviceName} = useContext(DeviceExchangeParentContext);

  useEffect(()=>{
    if(searchInput){
      SetIsComponentVisible(true);
    }else{
      SetIsComponentVisible(false);
    }
    
  },[searchInput,SetIsComponentVisible]);


  const handleSearchInput =(e: ChangeEvent<HTMLInputElement>) =>{
    setSearchInput(e.target.value);
    setParentDeviceName(e.target.value);
    setIsDeviceParentIdValid(false);
    setListActive(true);
  }


  const handleClickParent = (name:string,userName:string,trackDivisionId:string) =>{
    setSearchInput(`${name} (${userName})`);
    setParentDeviceName(`${name} (${userName})`);
    setIsDeviceParentIdValid(trackUserData?.data.result.find(x => x.user_name === userName) ? true : false);
    setListActive(!listActive);
    setDivisionId(trackDivisionId);
  }

  const filteredData = searchInput ? trackUserData?.data.result.filter(x => x.name.toLowerCase().includes(searchInput.toLowerCase()) || x.user_name.toLowerCase().includes(searchInput.toLowerCase())) : trackUserData?.data.result;


  return (
    <div className="relative z-40 w-full">
      <input
        type="search"
        id={`input-search-${placeHolder}`}
        placeholder={placeHolder ? placeHolder : 'Enter Search'}
        value={searchInput}
        onChange={(e) => handleSearchInput(e)}
        className={`block w-full p-2 text-sm text-black border-b-2 outline-none border-gray-400 rounded-sm focus:border-dark bg-gray-50`}
        required
        autoComplete='off' />

      {
        listActive && isComponentVisible  &&(
          <div ref={ref} className={`w-full z-30 absolute py-2 max-h-64 bg-gray-200 px-2 ${InputSearchCss.searchListContainer}`}>
            
            <ul>
              {
                filteredData?.length != 0 ?

                filteredData?.map((item, index) => (
                  <li onClick={()=> handleClickParent(item.name,item.user_name,item.id)} className='py-1.5 flex gap-2 text-sm border-b-2 border-gray-300 text-wrap cursor-pointer' key={index}>
                    <span>{item.name}</span>
                    <span className='font-medium'>({item.user_name})</span>
                  </li>
                ))
                :
                <p className='m-0 text-xs font-normal text-center'>Data Not Found</p>
              }
            </ul>
          </div>

        )
      }


    </div>
  )
}

export default InputWithSearchParent;
