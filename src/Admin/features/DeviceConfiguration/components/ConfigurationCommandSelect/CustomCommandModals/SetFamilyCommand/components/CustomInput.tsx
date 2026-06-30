import { useField } from "formik";





const CustomInput = ({label,placeHolder,...props}:any) => {

    const [field,meta] = useField(props);


  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={`input_${label}`} className="font-semibold text-xss">{label}</label>
      <input 
      {...field} 
      {...props}
      className="px-1 py-2 duration-100 ease-in border-2 border-gray-500 rounded focus:border-black w-80" 
      placeholder={placeHolder} />
      {
        meta.touched && meta.error ? (
            <div className="mt-1 font-light text-red-600 text-error error">
                {meta.error}
            </div>
        ): null
      }
    </div>
  )
}

export default CustomInput;
