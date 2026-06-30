import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { useField } from "formik";



const CustomFormikInput = ({label,labelClass,...props}:any) =>{

    const [field,meta] = useField(props);

    return(
        <FormControl>
            <FormLabel className={labelClass}>
                {label}
            </FormLabel>
            <Input {...field}  {...props} />
            {
                meta.touched && meta.error  ?
                (
                    <FormHelperText className="!text-red-600">
                        {meta.error}
                    </FormHelperText>
                )
                :
                null
            }
        </FormControl>
    )
}


export default CustomFormikInput;