export interface ReportModuleInterface{
    id: string,
    moduleName: string,
    displayName: string,
    displayOrder: number,
    subModules: [
        {
            id: string,
            moduleName: string,
            displayName: string,
            displayOrder: number,
            subModules: any,
            typeId: number
        }
    ],
    typeId: number
}



export interface SubModuleInterface{
    id: string,
    moduleName: string,
    displayName: string,
    displayOrder: number,
    subModules: any,
    typeId: number
}