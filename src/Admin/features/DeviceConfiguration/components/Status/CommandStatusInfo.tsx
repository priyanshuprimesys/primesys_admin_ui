import { IconComponents } from '../../../../../global/Icons/IconsStore';

interface CommandStatusInfoProps{
    commandResponse:string;
}



const CommandStatusInfo: React.FC<CommandStatusInfoProps> = ({commandResponse}) => {
  return (
    <div className="flex items-center justify-center">
      {
      commandResponse == 'device_is_not_connected_to_server' ?
        IconComponents.serverOff
        :
        commandResponse == "send_command_successfully" ?
        IconComponents.sentSuccess
        :
        commandResponse == "node_down_device_is_not_connected" ?
        IconComponents.networkDown
        :
        ''

    }
    </div>
  )
}

export default CommandStatusInfo
