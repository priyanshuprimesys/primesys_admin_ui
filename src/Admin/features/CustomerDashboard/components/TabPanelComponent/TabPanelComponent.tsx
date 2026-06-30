import { TabInterface } from "../../interfaces/TabPanelInterface/TabInterface";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

interface TabPanelInterface {
  tabComp: TabInterface[];
}

const TabPanelComponent: React.FC<TabPanelInterface> = ({ tabComp }) => {
  return (
    <>
      <Tabs bgColor={'white'}  isFitted size={"lg"} className="h-[90vh] scrollbar overflow-y-auto border border-black rounded-lg" variant="enclosed">
        <TabList className="!border-b-2 border-black">
          {tabComp.map((item, index) => (
            <Tab className="font-bold" key={index}>{item.tabHeader}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabComp.map((item, index) => (
            <TabPanel key={index}>{item.tabContent}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabPanelComponent;
