import { IDivisionDevicesDetailResponseInterface } from "../../interfaces/DivisionAllDevices/DivisionDevicesDetailResponseInterface";
import { DivisionDevicesInitialState } from "../DivisionDevicesInitialState/DivisionDevicesInitialState";

export const DivisionDeviceDetailResponseInitialState:IDivisionDevicesDetailResponseInterface={
    data:{
        result:[DivisionDevicesInitialState]
    },
    success:false
}