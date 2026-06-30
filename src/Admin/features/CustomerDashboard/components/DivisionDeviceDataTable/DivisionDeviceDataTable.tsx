import { useContext, useState } from "react"
import Table from "../../../../../global/components/Table/Table"
import TableBody from "../../../../../global/components/Table/TableBody/TableBody"
import TableCaption from "../../../../../global/components/Table/TableCaption/TableCaption"
import TableHead from "../../../../../global/components/Table/TableHead/TableHead"
import { CustomerLoginDetailContext } from "../../context/CustomerLoginDetailContext/CustomerLoginDetailContext"
import { DivisionDeviceCountContext } from "../../context/DivisionDeviceCountContext/DivisionDeviceCountContext"
import { useToast } from "@chakra-ui/react";
import {IconButton} from "@chakra-ui/react";
import { IconComponents } from "../../../../../global/Icons/IconsStore"
import { useQueryClient } from "@tanstack/react-query"
import { customer_division_devices_location } from "../../queryKey/queryKey"

const Thead = [
    'All Device',
    'On Device',
    'On Today Device',
    'Off Today Device',
    'Off Since Last 48hrs',
    'Action'
  ]

export const DivisionDeviceDataTable = () => {

    const {customerEmail,customerPassword,parentUserName,loginName} = useContext(CustomerLoginDetailContext);
    const toast = useToast();
    const [_deviceGroupName,setDeviceGroupName] = useState<string>("");
    // const [apiTime,setApiTime] = useState<string>('');
    const {
        allDeviceCount,
        OnDeviceCount,
        OnTodayDeviceCount,
        OffTodayDeviceCount,
        OffLast48DeviceCount
    } = useContext(DivisionDeviceCountContext);
    const queryClient = useQueryClient();




    const handleDevices = (name:string) =>{
        setDeviceGroupName(name);
    } 


    const handleError = () =>{
        toast({
            title:'No Device Found',
            status:'error',
            duration:1000,
            isClosable:true,
            variant:'left-accent'
        })
    }


    const handleClick = () =>{
        queryClient.invalidateQueries({queryKey:[customer_division_devices_location]});
    }

   



    const captionDetail = [
        {
            id:0,
            label:"Divison Id",
            value:parentUserName
        },
        {
            id:1,
            label:"Login Name",
            value:loginName
        },
        {
            id:2,
            label:"Division User Id",
            value:customerEmail
        },
        {
            id:3,
            label:"Divison User Password",
            value:customerPassword
        },

    ]

    const tableData = [
        {
            id:0,
            value:<h1 onClick={allDeviceCount > 0 ? ()=> handleDevices("Hello") : handleError} className="text-sm font-semibold cursor-pointer bg-gray-200 px-2 text-black">{allDeviceCount}</h1> ,
        },
        {
            id:1,
            value:<h1 onClick={OnDeviceCount > 0 ? ()=> handleDevices("Hello") : handleError} className="text-sm font-semibold cursor-pointer bg-gray-200 px-2 text-green-600">{OnDeviceCount}</h1>,
        },
        {
            id:2,
            value:<h1 onClick={OnTodayDeviceCount > 0 ? ()=> handleDevices("Hello") : handleError} className="text-sm font-semibold cursor-pointer bg-gray-200 px-2 text-orange-600">{OnTodayDeviceCount}</h1>,
        },
        {
            id:3,
            value:<h1 onClick={OffTodayDeviceCount > 0 ? ()=> handleDevices("Hello") : handleError} className="text-sm font-semibold cursor-pointer bg-gray-200 px-2 text-red-600">{OffTodayDeviceCount}</h1>,
        },
        {
            id:4,
            value:<h1 onClick={OffLast48DeviceCount > 0 ? ()=> handleDevices("Hello") : handleError} className="text-sm font-semibold cursor-pointer bg-gray-200 px-2 text-gray-700">{OffLast48DeviceCount}</h1>,
        },
        {
            id:5,
            value:<h1><IconButton onClick={handleClick} aria-label="refresh" colorScheme="blue" icon={IconComponents.refreshIcon} /></h1>
        }
    ]


  return (
    <>
        <Table>
            <TableCaption>
                <h1 className="text-base">
                    Division Detail
                </h1>
                <div className="flex w-full justify-around">
                    {
                        captionDetail.map((item,index)=>(
                            <div key={index} className="flex-col items-center gap-2  ">
                                <h1 className="text-sm font-bold">{item.label}</h1>
                                <p className="m-0 text-sm">{item.value}</p>
                            </div>
                        ))
                    }
                </div>
            </TableCaption>
            <TableHead tableHead={Thead} headClassName="uppercase" />
            <TableBody data={tableData}  />
        </Table>
    </>
  )
}
