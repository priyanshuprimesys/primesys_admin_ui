import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import HirearchyDataTable from "./components/HirearchyDataTable/HirearchyDataTable";
import HirearchyParentDataSearch from "./components/ParentDataSearch/HirearchyParentDataSearch";
import HierarchyChart from "./feature/HirearchyChart";
import DeviceHeatmap from "./components/DeviceHeatmap/DeviceHeatmap";

const HirearchyModule = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* parent search — always visible */}
            <div className="flex-shrink-0 px-3 pt-3 pb-2 bg-white border-b border-gray-200">
                <HirearchyParentDataSearch />
            </div>

            <Tabs variant="soft-rounded" colorScheme="gray" display="flex" flexDirection="column" flex={1} overflow="hidden">
                <TabList px={3} pt={2} flexShrink={0}>
                    <Tab className="font-bold">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 6h4M10 18h4" />
                            </svg>
                            List View
                        </span>
                    </Tab>
                    <Tab className="font-bold">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Tree View
                        </span>
                    </Tab>
                    <Tab className="font-bold">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Device Coverage
                        </span>
                    </Tab>
                </TabList>

                <TabPanels flex={1} overflow="hidden">
                    <TabPanel p={3} height="100%" overflowY="auto">
                        <HirearchyDataTable />
                    </TabPanel>
                    <TabPanel p={3} height="100%" overflowY="auto">
                        <HierarchyChart />
                    </TabPanel>
                    <TabPanel p={3} height="100%" overflowY="auto">
                        <DeviceHeatmap />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
};

export default HirearchyModule;
