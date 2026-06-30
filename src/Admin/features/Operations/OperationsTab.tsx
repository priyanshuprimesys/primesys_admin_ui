import { useContext } from "react";
import {
    Box,
    Heading,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@chakra-ui/react";

import { SosWhitelistSection } from "./components/SosWhitelistSection";
import { SimUploadSection } from "./components/SimUploadSection";
import { ServerControlSection } from "./components/ServerControlSection";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

/** Role allowed to control the erlang server. */
const SERVER_OPS_ROLE_ID = 20;

const OperationsTab = () => {
    const { userDetail } = useContext(UserDetailContext);
    const canControlServer =
        userDetail?.data?.result?.roleId === SERVER_OPS_ROLE_ID;

    return (
        <Box
            h="90vh"
            bg="gray.50"
            p={{ base: 2, md: 4 }}
            borderRadius="xl"
            overflowY="auto"
        >
            <Heading size="lg" mb={4}>
                Operations
            </Heading>

            <Tabs colorScheme="teal" variant="enclosed" bg="white" borderRadius="lg" p={3}>
                <TabList>
                    <Tab>SOS</Tab>
                    <Tab>SIM Upload</Tab>
                    {canControlServer && <Tab>Server</Tab>}
                </TabList>

                <TabPanels>
                    <TabPanel px={1}>
                        <SosWhitelistSection />
                    </TabPanel>
                    <TabPanel px={1}>
                        <SimUploadSection />
                    </TabPanel>
                    {canControlServer && (
                        <TabPanel px={1}>
                            <ServerControlSection />
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default OperationsTab;
