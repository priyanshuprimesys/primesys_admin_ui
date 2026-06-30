import {RadioGroup,Radio,Stack} from  "@chakra-ui/react";


export interface RadioLabelValueInterface{
    label:string;
    value:string;
    colorScheme:string;
    size:string;
    borderColor?:string
}



interface DeviceActiveInterface{
    value:string;
    setValue:(text:string) => void;
    data:RadioLabelValueInterface[];
}


const DeviceActiveRadio: React.FC<DeviceActiveInterface> = ({value,setValue,data}) =>{
    return (
        <>
            <RadioGroup className="py-2" onChange={setValue} value={value} >
                <Stack direction={'row'} className="items-center justify-center">
                    {
                        data.map((item,index)=>(
                            <Radio borderColor={item.borderColor} size={item.size} colorScheme={item.colorScheme} key={index} value={item.value}>{item.label}</Radio>
                        ))
                    }
                </Stack>
            </RadioGroup>
        </>
    )
}


export default DeviceActiveRadio;