import { ChildrenNavigationRouteInterface } from "./ChildrenNavigationRouteInterface";

export interface RouteNavigationInterface{
    path:string;
    name:string;
    icon:Element | null;
    element: React.ReactNode;
    isSidebarMenu:boolean;
    isPrivate:boolean;
    errorElement:() => React.ReactNode | null;
    children?:ChildrenNavigationRouteInterface[] | null | undefined;
}