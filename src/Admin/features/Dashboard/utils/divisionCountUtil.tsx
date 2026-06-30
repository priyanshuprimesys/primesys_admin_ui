import { IAdminDevicesResponse } from "../../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface";

const divisionCount = (devices: IAdminDevicesResponse) => {
    const grouped = devices.data.result.reduce((acc, item) => {
        const { divisionId } = item;
        if (!acc[divisionId]) {
            acc[divisionId] = [];
        }
        acc[divisionId].push(item);
        return acc;
    }, {} as Record<string, typeof devices.data.result>);
    

    const totalGroup = Object.keys(grouped).length; 
    
    return {totalGroup};
};

export default divisionCount;
