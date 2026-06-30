

interface DateTimePickerProps{
    date:string;
    onDateChange:(event: React.ChangeEvent<HTMLInputElement>)=> void;
    className?:string;
    maxDate?:string;
    minDate?:string;
    disabled?:boolean
}



const DateTimePicker: React.FC<DateTimePickerProps> = ({date,onDateChange,className,maxDate,minDate,disabled}) => {



  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">

      </div>
      <input disabled={disabled} value={date} min={minDate} max={maxDate}  onChange={onDateChange}  type="datetime-local" className={`px-2 py-1 border-2 border-black rounded cursor-pointer ${className}`} />
    </div>
  )
}

export default DateTimePicker;
