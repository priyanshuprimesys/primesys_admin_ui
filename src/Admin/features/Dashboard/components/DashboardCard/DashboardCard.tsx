import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { CiMobile4 } from "react-icons/ci";
import { AdminDevicesContext } from "../../../../../contexts/AppLayout/AdminDevicesContext/AdminDevicesContext";
import divisionCount from "../../utils/divisionCountUtil";


const DashboardCard = () =>{

    const {adminDevices} = useContext(AdminDevicesContext);
    const {totalGroup} = divisionCount(adminDevices);

    const dashboardJSON=[
        {
            "id":1,
            "name":"All Devices",
            "icon": <CiMobile4 color="black" size={24} />,
            "count": adminDevices.data.result.length > 1 ?  <Text letterSpacing={'wide'} fontWeight={'normal'} fontSize={'2xl'} >{adminDevices.data.result.length}</Text>   : <Text fontSize={'sm'} fontWeight={'thin'}><em>loading....</em></Text>
        },
        {
            "id":2,
            "name":"Devices Groups",
            "icon": <CiMobile4 color="black" size={24} />,
            "count": totalGroup > 1 ? <Text letterSpacing={'wide'} fontWeight={'normal'} fontSize={'2xl'} >{totalGroup}</Text>   : <Text fontSize={'sm'} fontWeight={'thin'}><em>loading....</em></Text>
            
        },
    ]



    return(
        <>
        <div className="flex w-full flex-wrap gap-4">
            {
                dashboardJSON.map((item,index)=>(
                    <Card key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                        <CardHeader className="flex items-center justify-between">
                            <Heading size={'md'}>{item.name}</Heading>
                            <Heading>{item.icon}</Heading>
                        </CardHeader>
                        <CardBody>
                            {item.count}
                        </CardBody>
                    </Card>
                ))
            }
        </div>

        </>
    )
}



export default DashboardCard;