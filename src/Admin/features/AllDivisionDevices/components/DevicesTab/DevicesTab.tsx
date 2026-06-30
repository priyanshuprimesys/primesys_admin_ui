import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import AllDivisionDevices from "../AllDivisionDevices/AllDivisionDevices";
import DivisionIdDevices from "../DivisionIdDevices/DivisionIdDevices";
import { DeviceDataExcelUpload } from "../modules/DeviceDataExcelUpload/DeviceDataExcelUpload";
import { DeviceInfo } from "../modules/DevicesInfo/DeviceInfo";
import { DeviceTypeList } from "../DeviceTypeList/DeviceTypeList";
import ExpiryAlertView from "../ExpiryAlertView/ExpiryAlertView";
import StaleDevicesView from "../StaleDevicesView/StaleDevicesView";

const DevicesTab = () => {
  return (
    <>
      <Tabs className="px-4 py-4 rounded shadow-blackShadow" variant="soft-rounded" colorScheme="blue" fontWeight={'bold'} backgroundColor={'white'}>
        <TabList>
          <Tab>All Division Devices</Tab>
          <Tab>Division Devices</Tab>
          <Tab>Expiry Alerts</Tab>
          <Tab>Stale Devices</Tab>
          <Tab>Device Info</Tab>
          <Tab>Device Excel Update</Tab>
          <Tab>Device Type List</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AllDivisionDevices />
          </TabPanel>
          <TabPanel>
            <DivisionIdDevices />
          </TabPanel>
          <TabPanel>
            <ExpiryAlertView />
          </TabPanel>
          <TabPanel>
            <StaleDevicesView />
          </TabPanel>
          <TabPanel>
            <DeviceInfo />
          </TabPanel>
          <TabPanel>
            {/* <DeviceDetail/> */}
            <DeviceDataExcelUpload />
          </TabPanel>
          <TabPanel>
            <DeviceTypeList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default DevicesTab;
