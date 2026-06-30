import { createContext, MutableRefObject } from "react";
import { IHirearchyTrackUserRequestInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserRequestInterface";
import { HirearchyTrackUserRequestInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyTrackUserInitialState/HirearchyTrackUserRequestInitialState";



interface trackUserProps{
    hirearchyTrackUserRef: MutableRefObject<IHirearchyTrackUserRequestInterface>;
}

const trackUserDefaultValue:trackUserProps={
    hirearchyTrackUserRef:{current:HirearchyTrackUserRequestInitialState}
}



export const HirearchyTrackUserContext = createContext(trackUserDefaultValue);