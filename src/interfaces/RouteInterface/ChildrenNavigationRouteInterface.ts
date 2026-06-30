import { ReactElement } from "react";


type DataFunctionValue = any;

export type LoaderFunction = () => Promise<DataFunctionValue>;


export interface ChildrenNavigationRouteInterface{
    path:string;
    innerPath:string;
    name:string;
    icon: ReactElement | null;
    element: React.ReactNode;
    isSidebarMenu:boolean;
    isPrivate:boolean;
    loaderFun?: LoaderFunction  | undefined| any;
    errorElement: React.ReactNode;
    children?:ChildrenNavigationRouteInterface[] | null | undefined
}