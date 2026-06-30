import {z} from "zod";
import {useForm, FormProvider} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { SuccessInterface } from "../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";

/***
 * Schema
 */


export const DeviceInspectionSchema = z.object({
    name: z.string(),
    imeiNo: z.string(),
    issuePerLetter: z.string(),
    inspectionByPrimesysRepresentative: z.string(),
    finalReport: z.string(),
    remark: z.string(),
    afterTested: z.string()
});



/**
 * Hooks
 */

export type DeviceCreateForm = z.infer<typeof DeviceInspectionSchema>;


export const useFormCreateDeviceInspection = () => useForm<DeviceCreateForm>({
    resolver: zodResolver(DeviceInspectionSchema),
});


/****
 * context
 */

export const DeviceCreateInspectionProvider = ({children}:{children:React.ReactNode}) =>{
    const methods = useFormCreateDeviceInspection();
    return <FormProvider {...methods}>{children}</FormProvider>
}

export interface IInspectionDevices{
    srNo: number,
    deviceName: string,
    imeiNumber: string,
    issue: string,
    inspection: string,
    finalReport: string,
    remark: string,
    afterTested: string
}

export interface IDeviceInspectionReport{
    id?:string,
    divisionId: string,
    divisionName: string,
    reportDate: number,
    devices: IInspectionDevices[]
}

export interface IDeviceInspectionReportResponseList extends SuccessInterface{
    data:{
        result: IDeviceInspectionReport[]
    }
}



export interface IDeviceInspectionReportResponse extends SuccessInterface{
    data:{
        result: IDeviceInspectionReport
    }
}