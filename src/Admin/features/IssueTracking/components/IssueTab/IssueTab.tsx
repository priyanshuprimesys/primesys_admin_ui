import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import IssueDashboard from "../IssueDashboard/IssueDashboard";
import { AllIssueDashboard } from "../AllIssueDashboard/AllIssueDashboard";
import { SkippedIssueDashboard } from "../SkippedIssues/SkippedIssueDashboard";
import { IssueCustomerChat } from "../../modules/IssueCustomerChat/IssueCustomerChat";
import IssueMessageDashboard from "../../modules/IssueMessageDashboard/IssueMessageDashboard";


export default function IssueTab() {
    return (
        <div>
            <Tabs variant='soft-rounded' colorScheme='blue'>
                <TabList>
                    <Tab className="font-bold">Issue Dashboard</Tab>
                    <Tab className="font-bold">Issue Messages</Tab>
                    <Tab className="font-bold">All Issues</Tab>
                    <Tab className="font-bold">Skipped Issues</Tab>
                    <Tab className="font-bold">Issue Customer Chat</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <IssueDashboard />
                    </TabPanel>
                    <TabPanel className="w-full" width={'100%'}>
                        <IssueMessageDashboard />
                    </TabPanel>
                    <TabPanel>
                        <AllIssueDashboard />
                    </TabPanel>
                    <TabPanel>
                        <SkippedIssueDashboard />
                    </TabPanel>
                    <TabPanel >
                        <IssueCustomerChat />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}