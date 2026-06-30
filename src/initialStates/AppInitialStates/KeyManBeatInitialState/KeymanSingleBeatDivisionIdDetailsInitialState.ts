import { IKeymanSingleDivisionIdDetailsInterface } from "../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanSingleDivisionIdDetailsInterface";
import { KeymanSingleBeatDivisionIdInitialState } from "./KeymanSingleBeatDivisionIdInitialState";




export const KeymanSingleBeatDivisionIdDetails:IKeymanSingleDivisionIdDetailsInterface={
    data: {
        result: [KeymanSingleBeatDivisionIdInitialState]
    },
    success: false,
    error: {
        code: 0,
        message: ""
    }
}