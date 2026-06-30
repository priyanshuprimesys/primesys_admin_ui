import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import RdpsUtility from "../../features/RdpsUtility/RdpsUtility";
import ReportGeneration from "../../features/ReportGeneration/ReportGeneration";
import { RiTriangularFlagFill } from "react-icons/ri";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import RdpsCalculate from "../../features/RdpsCalculate/RdpsCalculate";

const TabContainer = () => {
  return (
    <>
      <Tabs isFitted backgroundColor={'white'} borderRadius={10}>
        <TabList>
          <Tab className="gap-2">
            <RiTriangularFlagFill size={24} color="black" />
             <span className="font-semibold text-base">Rdps Utility</span>
          </Tab>
          <Tab className="gap-2">
             <span className="font-semibold text-base">Rdps Calculation</span>
          </Tab>
          <Tab className="gap-2">
            {IconComponents.copyIcon}
          <span className="font-semibold text-base">Report Generation</span>
          </Tab>
          {/* <Tab>Three</Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel>
            <RdpsUtility/>
          </TabPanel>
          <TabPanel>
            <RdpsCalculate/>
          </TabPanel>
          <TabPanel>
            <ReportGeneration/>
          </TabPanel>
          {/* <TabPanel>
            <p>three!</p>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabContainer;
