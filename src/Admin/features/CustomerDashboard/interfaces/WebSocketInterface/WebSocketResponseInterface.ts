import { ILocationDataInterface } from "./LocationDataInterface";

export interface IWebSocketResponseInterface{
    data: ILocationDataInterface
    event: string
}