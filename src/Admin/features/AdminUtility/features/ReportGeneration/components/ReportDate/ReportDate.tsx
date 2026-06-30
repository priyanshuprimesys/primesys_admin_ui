import DatePicker from "react-datepicker";
import "../../styles/datePickerCss.css";


interface DateInterface{
    startDate:Date | null,
    setReportDate:(date:Date) => void
}




const ReportDate: React.FC<DateInterface> = ({startDate,setReportDate}) =>{


     

    return(
        <>
        <div className="w-full">
          <DatePicker
                selected={startDate}
                dateFormat={"dd/MM/yyyy"}
                className="py-2 border-2 focus:border-2 rounded px-2 w-full text-center border-black"
                onChange={(date) => setReportDate(date ? date : new Date())}
            />
        </div>
        </>
    )
}



export default ReportDate;