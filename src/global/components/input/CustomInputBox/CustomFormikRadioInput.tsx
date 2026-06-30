import { useField } from "formik"





const CustomFormikRadioInput = ({ label, placeHolder, ...props }: any) => {

    const [field, meta] = useField(props);

    return (
        <div>
            <label htmlFor={`input_${label}`} className="flex items-center space-x-2">
            <input
            type="radio"
                {...field}
                {...props}
                placeholder={placeHolder}
                className="w-4 h-4 text-blue-600 bg-blue-900 border-2 border-blue-800 cursor-pointer"
                value={props.value}
                id={`input_${label}`} />
                <span className="text-xs font-semibold">{label}</span>
            </label>

            {
                meta.touched && meta.error ? (
                    <div className="mt-1 font-light text-red-600 text-error">
                        {meta.error}
                    </div>
                )
                    :
                    null
            }
        </div>
    )
}

export default CustomFormikRadioInput
