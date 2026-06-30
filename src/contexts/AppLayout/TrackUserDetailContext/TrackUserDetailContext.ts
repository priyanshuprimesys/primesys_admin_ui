import { createContext } from "react";
import { TrackUserInitialState } from "../../../initialStates/AppInitialStates/TrackUserInitialState/TrackUserInitialState";
import { TrackUserDetailInterface } from "../../../interfaces/AppInterfaces/TrackUserInterface/TrackUserDetailInterface";







interface TrackUserProps{
    trackUserDetail:TrackUserDetailInterface;
    setTrackUserDetail:React.Dispatch<React.SetStateAction<TrackUserDetailInterface>>;
}



const trackUserDefaultValue:TrackUserProps={
    trackUserDetail:TrackUserInitialState,
    setTrackUserDetail:()=> {}
}


export const TrackUserDetailContext = createContext(trackUserDefaultValue);