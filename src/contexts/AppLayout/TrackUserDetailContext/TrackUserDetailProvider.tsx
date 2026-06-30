import { useState } from "react"
import { TrackUserDetailContext } from "./TrackUserDetailContext"
import { TrackUserInitialState } from "../../../initialStates/AppInitialStates/TrackUserInitialState/TrackUserInitialState"
import { TrackUserDetailInterface } from "../../../interfaces/AppInterfaces/TrackUserInterface/TrackUserDetailInterface";














export const TrackUserDetailProvider = ({children}:any) => {

    const [trackUserDetail,setTrackUserDetail] = useState<TrackUserDetailInterface>(TrackUserInitialState);


    return(
        <>
        <TrackUserDetailContext.Provider value={{ trackUserDetail,setTrackUserDetail }}>
            {children}
        </TrackUserDetailContext.Provider>
        </>
    )
}



