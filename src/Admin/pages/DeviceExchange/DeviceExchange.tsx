import { DeviceExchangeDataTable, DeviceExchangeForm, DeviceExchangeStatus } from "../../features/DeviceExchange";
import ReplaceButton from "../../features/DeviceExchange/components/ReplaceDevices/ReplaceButton";
import ReplaceDeviceModal from "../../features/DeviceExchange/components/ReplaceDevices/ReplaceDeviceModal";
import { useDisclosure } from "@chakra-ui/react";

const DeviceExchange = () => {

  const {isOpen,onClose,onOpen} = useDisclosure();




  return (
    <>
      <div>
        <ReplaceButton onHandleClick={onOpen} />
        <div className="grid w-full grid-cols-2 gap-6 overflow-hiddens">
          <DeviceExchangeForm />
          <DeviceExchangeStatus />
        </div>
      </div>

      
      <div className="mt-6">
          <DeviceExchangeDataTable/>
      </div>

      {isOpen && <ReplaceDeviceModal onClose={onClose} isOpen={isOpen} />}
    </>

  )
}

export default DeviceExchange;
