import { useField } from "formik"




const CustomSelectFormikInput = ({ label, ...props }: any) => {

    const [field, meta] = useField(props);


    return (
        <div className="">
            <label htmlFor={`input_${label}`}>{label}</label>
            <select
                {...field}
                {...props}
                className="px-1 py-2 duration-100 ease-in border-2 border-gray-500 rounded focus:border-black w-80"
            >
            </select>
            {
                meta.touched && meta.error ? (
                    <div className="mt-1 font-light text-red-600 text-error error">
                        {meta.error}
                    </div>
                ) : null
            }
        </div>
    )
}

export default CustomSelectFormikInput;
