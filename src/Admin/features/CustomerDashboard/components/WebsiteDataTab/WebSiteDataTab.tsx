import CustomerHistory from "../../features/History";
import CustomerReport from "../../features/Report";
import CustomerTrack from "../../features/Track";
import { TabInterface } from "../../interfaces/TabPanelInterface/TabInterface";
import TabPanelComponent from "../TabPanelComponent/TabPanelComponent";



const tabComponent:TabInterface[] = [
    {
        tabHeader:"Track",
        tabContent: <CustomerTrack/>
    },
    {
        tabHeader:"History",
        tabContent: <CustomerHistory/>
    },
    {
        tabHeader:"Report",
        tabContent: <CustomerReport/>
    }
]






const WebSiteDataTab = () => {
  return (
    <>
        <TabPanelComponent tabComp={tabComponent} />
    </>
  )
}



export default WebSiteDataTab;