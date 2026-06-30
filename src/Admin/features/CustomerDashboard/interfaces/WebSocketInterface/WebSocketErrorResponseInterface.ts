import { IErrorDataInterface } from "./ErrorDataInterface";
import { ILocationDataInterface } from "./LocationDataInterface";

export interface IWebSocketErrorResponseInterface{
    data: ILocationDataInterface | IErrorDataInterface,
    event:string
}