import CustomButton from "../../../../../../global/components/button/CustomButton";
import { IconsStore } from "../../../../../../global/Icons/IconsStore";


interface CommandHistoryButtonProps{
    onHandleCommandHistory:() => void;
    disabled?:boolean
}



const CommandHistoryButton: React.FC<CommandHistoryButtonProps> = ({onHandleCommandHistory,disabled}) => {
  return (
    <>
     <CustomButton
     disabled={disabled}
     onHandleSubmit={onHandleCommandHistory}
        icon={IconsStore.historyIcon}
        type="button"
        name="History"
        className="flex items-center px-4 py-1 text-xs text-white bg-primary"
      /> 
    </>
  )
}

export default CommandHistoryButton
