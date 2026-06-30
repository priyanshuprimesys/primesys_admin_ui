import { useContext, useEffect } from "react"
import DeviceExchangeButton from "../DeviceExchangeButton/DeviceExchangeButton"
import DeviceSearchHeader from "../DeviceSearchHeader/DeviceSearchHeader"
import { DeviceExchangeStudentContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeStudentContext/DeviceExchangeStudentContext"
import { useExchangeDeviceQuery } from "../../../../../api/queries/app/hooks/device-exchange-api-hooks"
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext"
import DeviceReplaceButton from "../DeviceExchangeButton/DeviceReplaceButton"
import { DeviceExchangeResponseContext } from "../../../../../contexts/AppLayout/DeviceExchangeContext/DeviceExchangeResponseContext/DeviceExchangeResponseContext"
import DeviceExchangeResetButton from "../DeviceExchangeButton/DeviceExchangeResetButton"

const DeviceExchangeForm = () => {

    const {studentDeviceOne,studentDeviceSecond} = useContext(DeviceExchangeStudentContext);
    const {userDetail} = useContext(UserDetailContext);
    const {setExchangeDataResponse}  = useContext(DeviceExchangeResponseContext);
    const username = userDetail.data.result.userName;

    const {mutate,isPending,data,isSuccess}  = useExchangeDeviceQuery();


    const handleExchangeDevice = (event: React.FormEvent) =>{
        event.preventDefault();
        if(studentDeviceOne && studentDeviceSecond && username){
            mutate({oldDeviceId:studentDeviceOne,newDeviceId:studentDeviceSecond,userId:username});
        }
      
    }


    useEffect(()=>{
        if(isSuccess){
            setExchangeDataResponse(data.data);
        }
    },[data,isSuccess]);


    return (
        <div className="px-2 py-4 bg-white">
            <form onSubmit={handleExchangeDevice} >
                <DeviceSearchHeader />
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex pt-4">
                        <DeviceReplaceButton/>
                        <DeviceExchangeResetButton/>
                    </div>
                    <div className="pt-4">
                        <DeviceExchangeButton isPending={isPending} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default DeviceExchangeForm
