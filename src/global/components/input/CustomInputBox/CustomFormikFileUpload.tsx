import { useField } from "formik";

const CustomFormikFileUpload = ({
  label,
  placeHolder,
  onChange,
  ...props
}: any) => {
  const [_field, meta] = useField(props);

  return (
    <>
      <div className="flex flex-col mb-4">
        <label htmlFor={`input_${label}`}>{label}</label>
        <input
          type="file"
          onChange={onChange}
          className="px-3 py-2 border-2 border-black rounded"
          placeholder={placeHolder}
        />
        {meta.touched && meta.error ? (
          <div className="mt-1 font-light text-red-600 text-error">
            {meta.error}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CustomFormikFileUpload;
