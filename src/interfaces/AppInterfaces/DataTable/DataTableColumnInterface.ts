import { ColumnMeta } from "@tanstack/react-table";






export interface DataTableColumnInterface<TData>{
    id?:string;
    accessorKey: string | keyof TData;
    header?: | string | (()=> unknown) | undefined;
    cell?: | string | ((props:{
        table?: any;
        row?:any;
        column?:any;
        cell?:any;
        getValue:() => any;
        renderValue?:() => any;
    })=>unknown);
    meta?: ColumnMeta<TData,unknown>;
    size?: number;
}