import { useContext } from "react"
import { IconComponents } from "../../../../../../global/Icons/IconsStore"
import { DeviceCommandContext } from "../../../../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { useInfoNotification } from "../../../../../../utils/hooks/notification/useInfoNotification";
import { useErrorNotification } from "../../../../../../utils/hooks/notification/useErrorNotification";
import { copyToClipboard } from "../../../../../../utils/clipboard/copyToClipboard";







export const SelectedCommand = () => {

    const {deviceCommand} = useContext(DeviceCommandContext);

    const copyCommand = async () =>{
        const text = deviceCommand;
        if(text)
        {
            const ok = await copyToClipboard(text);
            if(ok){
                useInfoNotification('Command Copied');
            } else {
                useErrorNotification('Failed to copy command');
            }
        }
        else{
            useErrorNotification('No Command Copied');
        }
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Selected Command</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                deviceCommand
                    ? 'bg-primary/10 border border-primary/25'
                    : 'bg-gray-100 border border-gray-200'
            }`}>
                <p
                    id="command"
                    className={`m-0 text-xs font-medium italic ${deviceCommand ? 'text-primary' : 'text-gray-400'}`}
                >
                    {deviceCommand === '' ? 'No Command Selected' : deviceCommand}
                </p>
                {deviceCommand && (
                    <button
                        type="button"
                        onClick={copyCommand}
                        title="Copy command"
                        className="text-primary hover:text-secondary transition-colors ml-1 flex items-center"
                    >
                        {IconComponents.copyIcon}
                    </button>
                )}
            </div>
        </div>
    )
}