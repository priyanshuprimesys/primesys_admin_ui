import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ReportPermission from "./ReportPermission";
import DivisionReportList from "./DivisionReportList";
import ReportModuleProvider from "./contexts/report-permission-moudle-context";
import { ReportConfiguration } from "./features/report-configuration";










const ReportPermissionTab = () => {
    return (
        <div>
            <ReportModuleProvider>
                <Tabs>
                    <TabList>
                        <Tab>Report Configurations</Tab>
                        <Tab>Division Reports</Tab>
                        <Tab>Report Permission</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <ReportConfiguration />
                        </TabPanel>
                        <TabPanel>
                            <DivisionReportList />
                        </TabPanel>
                        <TabPanel>
                            <ReportPermission />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </ReportModuleProvider>
        </div>
    )
}


export default ReportPermissionTab;