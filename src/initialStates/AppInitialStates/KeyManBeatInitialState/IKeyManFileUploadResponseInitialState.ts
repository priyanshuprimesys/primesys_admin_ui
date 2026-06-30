import { IKeyManFileUploadResponseInterface } from "../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManFileUploadResponseInterface";



export const KeyManFileUploadResponseInitialState:IKeyManFileUploadResponseInterface={
    data:{
        result:{
            validRecords:0,
            invalidRecords:0,
            errorDescription:""
        }
    },
    success:false
}