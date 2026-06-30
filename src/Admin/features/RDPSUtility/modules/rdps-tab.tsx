import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import RdpsMap from '../components/rdps-map';
import RdpsDataTable from '../components/rdps-table';



const RdpsTab = () =>{
    return(
        <Tabs>
            <TabList>
                <Tab>Map</Tab>
                <Tab>Table</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <RdpsMap/>
                </TabPanel>
                <TabPanel>
                   <RdpsDataTable/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}


export default RdpsTab;