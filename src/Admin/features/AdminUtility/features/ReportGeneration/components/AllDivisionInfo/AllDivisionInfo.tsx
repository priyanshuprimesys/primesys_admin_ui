import DeviceType from '../../data/deviceType.json';
import ShiftType from '../../data/shiftType.json';


interface DivisionInfo{
    deviceType:string,
    shiftType:string,
    reportDate: Date | null
}



const AllDivisionInfo: React.FC<DivisionInfo> = ({deviceType,shiftType,reportDate}) =>{

    const deviceName = DeviceType.filter(x => x.deviceSearch === Number(deviceType)).map(item=> item.deviceName);
    const shiftName = ShiftType.filter(x => x.shift === Number(shiftType)).map(item=> item.name);


    return(
        <div className='my-6 px-6'>
            <div className='flex gap-4'>
                <div>
                    <h1 className='font-bold text-base'>
                        Device Type:
                    </h1>
                    <h1 className='font-bold text-base'>
                        Shift Type:
                    </h1>
                    <h1 className='font-bold text-base'>
                        Report Date:
                    </h1>
                </div>
                <div>
                    <p className='font-semibold text-base'>
                        {deviceName}
                    </p>
                    <p className='font-semibold text-base'>
                        {shiftType !== '' ? shiftName : <span className='font-extralight text-gray-500'>Select shift type</span>}
                    </p>
                    <p className='font-semibold text-base'>
                        {reportDate ? new Date(reportDate).toLocaleDateString([],{day:'numeric',month:'short',year:'numeric'}) :  ''}
                    </p>
                </div>
            </div>
            <div className='my-4'>
                <h2 className='font-bold text-xs'>Note:</h2>
                <p className='text-xs'>Once you <b>click</b> on submit button <big className='font-semibold text-red-600'>OTP</big> will be generated and sent to the registered mail</p>
            </div>
        </div>
    )
}


export default AllDivisionInfo;