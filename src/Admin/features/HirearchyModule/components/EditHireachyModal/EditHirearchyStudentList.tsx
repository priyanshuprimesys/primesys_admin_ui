import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StudentDeviceDetailContext } from "../../../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import "../../../../../global/styles/GlobalCss.css";
import { HirearchyModuleUpdateContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleUpdateContext/HirearchyModuleUpdateContext";
import TextInputRef from "../TextInput/TextInputRef";
import { Button } from "@chakra-ui/react";
import CustomModal from "../../../../../global/components/CustomModal/CustomModal";

interface EditHirearchyProps {
  deviceList: string;
  clearSelectedDevice:boolean;
}

const EditHirearchyStudentList: React.FC<EditHirearchyProps> = ({
  deviceList,clearSelectedDevice
}) => {
  const { studentDeviceDetail , hirearchyDeviceTypeId} = useContext(StudentDeviceDetailContext);
  const [filteredEditDevices, setFilteredEditDevices] = useState<any[]>([]);
  const [onOpenModal, setOnOpenModal] = useState<boolean>(false);
  const [devicesNotFound, setDevicesNotFound] = useState<Array<any>>([]);
  const filteredDevicesRef = useRef<number[]>([]);
  const { updateDeviceListRef, setAllDeviceList,selectedDeviceList, allDeviceList, setSelectedDeviceList} = useContext(
    HirearchyModuleUpdateContext
  );
  const deviceNameId = useRef<HTMLInputElement | null>(null);

  const updateStudentDetail = useCallback(() => {
    const deviceNumber = deviceList?.split(",").map(Number);
    filteredDevicesRef.current = deviceNumber.filter((number) => number !== 0);
    updateDeviceListRef.current = deviceNumber
      .filter((num) => num !== 0)
      .join(",");
    setSelectedDeviceList(deviceNumber.filter((num) => num !== 0).join(","));
    setAllDeviceList(deviceNumber.filter((num) => num !== 0).join(","));


    if(studentDeviceDetail.success){
      const filteredStudentDevices = studentDeviceDetail.data?.result.map(
        (user) => ({
          ...user,
          isChecked: false,
        })
      );

      const filteredEditableDevices = filteredStudentDevices.map((user) =>
        filteredDevicesRef.current.includes(user.deviceNo)
          ? { ...user, isChecked: true }
          : user
      );

    
      setFilteredEditDevices(filteredEditableDevices);
    }else{
      setFilteredEditDevices([]);
    }


  }, [studentDeviceDetail]);

  useEffect(() => {
    updateStudentDetail();
  }, [studentDeviceDetail]);

  useEffect(()=>{
    if(Number(hirearchyDeviceTypeId) > 0){
      
      if(clearSelectedDevice){
        const deviceNumber = allDeviceList.split(",").map(Number);

        const newDeviceListArr = deviceNumber.filter((x)=> {
          return studentDeviceDetail.data.result.some((y)=> y.deviceTypeId === Number(hirearchyDeviceTypeId) && y.deviceNo == x);
        });
        setSelectedDeviceList(newDeviceListArr.join(','));
        return;
      }else{
        const deviceNumber = deviceList?.split(",").map(Number);

        const newDeviceListArr = deviceNumber.filter((x)=> {
          return studentDeviceDetail.data.result.some((y)=> y.deviceTypeId === Number(hirearchyDeviceTypeId) && y.deviceNo == x);
        });
        setSelectedDeviceList(newDeviceListArr.join(','));
      }


    }
  },[hirearchyDeviceTypeId]);



  const clearAllDevices = useCallback(()=>{
    const filteredStudentDevices = studentDeviceDetail.data.result.map((user) => Number(hirearchyDeviceTypeId) === 0 ? {...user,isChecked:false} : user.deviceTypeId === Number(hirearchyDeviceTypeId) ? {...user,isChecked:false}: user );
        
    const selectedDeviceArray = selectedDeviceList.split(",").map(item => Number(item));
    const allDeviceArray = allDeviceList.split(",").map(item => Number(item));
    const selectedArray = allDeviceArray.filter((obj)=> {return selectedDeviceArray.indexOf(obj) == -1});

    setSelectedDeviceList("");
    setAllDeviceList(selectedArray.join(","));
    filteredDevicesRef.current = selectedArray;
    updateDeviceListRef.current = selectedArray.join(",");
    setFilteredEditDevices(filteredStudentDevices);
  },[clearSelectedDevice]);

  useEffect(()=>{
    if(clearSelectedDevice === true)
    {
      clearAllDevices();
    }
  },[clearSelectedDevice]);





  const handleChangeEditDevice = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target;

    const deviceName = parseInt(name);

    if (checked) {
      filteredDevicesRef.current.push(deviceName);
    } else {
      filteredDevicesRef.current = filteredDevicesRef.current.filter(
        (device) => device !== deviceName
      );
    }
    const deviceSortedList = filteredDevicesRef.current.sort(
      (a, b) => Number(a) - Number(b)
    );
    updateDeviceListRef.current = deviceSortedList.join(",");
    
    setSelectedDeviceList(updateDeviceListRef.current);

    const currentDetail = filteredEditDevices.map((user) =>
      user.deviceNo == name ? { ...user, isChecked: checked } : user
    );

    setFilteredEditDevices(currentDetail);
  };

  const onSelectDevice = () => {





    if(deviceNameId.current && deviceNameId.current.value.length < 1)
    {
      alert('Please select devices');
      return;
    }
    else{
      const selectedDevice = deviceNameId.current?.value.split(',').map(Number).filter(x => x !== 0).map(String).filter(x => x!== 'NaN').map(Number).filter(x=> Number.isInteger(x));
      const devicesNotFound = selectedDevice?.filter((num)=> !filteredEditDevices.some((item)=> Number(hirearchyDeviceTypeId) == 0 ? item.deviceNo === num : item.deviceTypeId == Number(hirearchyDeviceTypeId) && item.deviceNo === num));
      const deviceFiltered = selectedDevice?.filter((num)=> !filteredDevicesRef.current.some((item)=> item === num));
      const newDeviceArray = [...new Set(deviceFiltered)];

  
  
      if(devicesNotFound && devicesNotFound.length > 0)
      {
        setDevicesNotFound(devicesNotFound);
        setOnOpenModal(true);
        return;
      }


      
      const updateFilterList = filteredEditDevices.map((device)=>({
        ...device,
        isChecked: device.isChecked || newDeviceArray.includes(device.deviceNo)
      }));

      const combinedList = [...newDeviceArray,...filteredDevicesRef.current].sort((a,b)=> a-b);


      if(combinedList)
      {
        filteredDevicesRef.current = combinedList;
        setSelectedDeviceList(combinedList.join(','))
        updateDeviceListRef.current = combinedList.join(',');
      }

  

      if (deviceNameId.current) {
        deviceNameId.current.value = "";
      }

      setFilteredEditDevices(updateFilterList);
  
    }

  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="w-full">
        <TextInputRef
          Type="string"
          inputRef={deviceNameId}
          placeHolder="Enter device Number"
          labelName="Device Numbers"
          padding="px-2 py-2"
          width="w-96"
        />
        </div>

        <Button colorScheme="blue" className="mt-4" onClick={onSelectDevice}>
          Select
        </Button>
      </div>
      <div className="max-w-xl px-1 mt-2 overflow-hidden border-2 rounded border-dark dataScroll max-h-48">
        <div className="flex flex-wrap w-full gap-4 px-1 py-2 text-justify">
          {filteredEditDevices.filter((x) => Number(hirearchyDeviceTypeId) == 0 ? true : x.deviceTypeId === Number(hirearchyDeviceTypeId)).map((item, index) => (
            <div key={index} className="flex gap-1">
              <input
                type="checkbox"
                disabled={false}
                id={item.deviceId}
                name={item.deviceNo}
                checked={item.isChecked}
                className="cursor-pointer"
                onChange={handleChangeEditDevice}
              />
              <span className="font-semibold">{item.deviceNo}</span>
            </div>
          ))}
        </div>
      </div>

      {onOpenModal && (
        <CustomModal
          modalHeader="Devices not found"
          setModalActive={setOnOpenModal}
        >
          <h1>These devices are not found in the Student list</h1>
          <div className="w-full ">
            <p className="overflow-auto break-all whitespace-normal">
              {devicesNotFound.join(",")}
            </p>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default EditHirearchyStudentList;
