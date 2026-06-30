import { Button } from "@chakra-ui/react";
import ExcelJs from "exceljs";
import { IconComponents } from "../../../../../../../global/Icons/IconsStore";
import { useSuccessNotification } from "../../../../../../../utils/hooks/notification/useSuccessNotification";


interface RdpsExcelInterface{
    deviceRdpsDetail: any[] | null
}




const RdpsExcel: React.FC<RdpsExcelInterface> = ({deviceRdpsDetail}) =>{


    const handleExcelReport = () =>{

        const workBook = new ExcelJs.Workbook();
        const sheet = workBook.addWorksheet("Rdps Detail");
        
        sheet.getRow(1).font={
            name:"Arial Black",
            color:{argb:"1,0,0,0"},
            size:10,
            bold:true
        }

        sheet.columns=[
            {
                header:"Kilometer",
                key:"kilometer",
                width:30
            },
            {
                header:"Distance",
                key:"distance",
                width:30
            },
            {
                header:"Latitude",
                key:"latitude",
                width:30
            },
            {
                header:"Longitude",
                key:"longitude",
                width:30
            },
            {
                header:"Section",
                key:"section",
                width:30
            },
            {
                header:"Feature Detail",
                key:"feature_detail",
                width:30
            },
            {
                header:"Feature Code",
                key:"feature_code",
                width:30
            },
        ];

        deviceRdpsDetail?.map(item=>{
            sheet.addRow({
                kilometer: item.kilometer,
                distance: item.distance,
                latitude: item.latitude,
                longitude: item.longitude,
                section: item.section,
                feature_detail: item.feature_detail,
                feature_code: item.feature_code
            })
        });

        workBook.xlsx.writeBuffer().then(data=>{
            const blob = new Blob([data],{
                type:"application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            });

            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `Division RDPS${new Date().toLocaleDateString([],{day:'2-digit',month:"2-digit",year:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}.xlsx`;
            anchor.click();
            useSuccessNotification("Report Downloaded");
            window.URL.revokeObjectURL(url);
        })

    }


    return(
        <>
            <Button onClick={handleExcelReport} className="!bg-white border-2 border-primaryDark">
                {IconComponents.excelIcon}                
            </Button>
        </>
    )
}


export default RdpsExcel;