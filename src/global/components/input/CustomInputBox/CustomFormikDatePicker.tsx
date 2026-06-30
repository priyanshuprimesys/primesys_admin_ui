import { useField } from "formik";
import DatePicker from "react-datepicker";
const CustomFormikDatePicker = ({ name }: any) => {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <DatePicker
      {...field}
      selected={value}
      className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
      onChange={(date) => setValue(date)}
    />
  );
};

export default CustomFormikDatePicker;
