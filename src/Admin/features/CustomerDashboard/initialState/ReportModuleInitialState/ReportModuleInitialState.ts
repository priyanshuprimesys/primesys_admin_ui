import { ReportModuleInterface } from "../../interfaces/ReportModuleInterface/ReportModuleInterface";



export const ReportModuleInitialState:ReportModuleInterface={
    id: "",
    moduleName: "",
    displayName: "",
    displayOrder: 0,
    subModules: [     {
        id: "",
        moduleName: "",
        displayName: "",
        displayOrder: 0,
        subModules: [],
        typeId: 0
    }],
    typeId: 0
}