import { Text, Textarea } from '@chakra-ui/react'
import { useState } from 'react';






const ReportTextArea = () =>{

    const [value, setValue] = useState<string>('');

    return(
        <>
            <Text mb='8px'>Devices Imei</Text>
            <Textarea
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                placeholder='Enter Devices Imei'
                size='md'
            />
        </>
    )
}



export default ReportTextArea;