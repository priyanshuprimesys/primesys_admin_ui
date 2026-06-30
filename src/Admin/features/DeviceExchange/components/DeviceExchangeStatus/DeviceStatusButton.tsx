




interface DeviceStatusProps{
    name:string;
}




const DeviceStatusButton: React.FC<DeviceStatusProps> = ({name}) => {
  return (
    <button type="button" className="px-4 py-1 text-xs text-gray-200 bg-green-700 rounded-3xl">
        {name}
    </button>
  )
}

export default DeviceStatusButton
