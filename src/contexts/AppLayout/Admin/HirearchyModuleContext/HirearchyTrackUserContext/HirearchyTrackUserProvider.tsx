import { useRef } from "react"
import { HirearchyTrackUserContext } from "./HirearchyTrackUserContext"
import { HirearchyTrackUserRequestInitialState } from "../../../../../initialStates/AppInitialStates/HirearchyInitialStates/HirearchyTrackUserInitialState/HirearchyTrackUserRequestInitialState"
import { IHirearchyTrackUserRequestInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserRequestInterface";








const HirearchyTrackUserProvider = ({children}:any) => {

  const hirearchyTrackUserRef = useRef<IHirearchyTrackUserRequestInterface>(HirearchyTrackUserRequestInitialState);


  return (
    <HirearchyTrackUserContext.Provider value={{ 
      hirearchyTrackUserRef
     }}>
      {children}
    </HirearchyTrackUserContext.Provider>
  )
}

export default HirearchyTrackUserProvider
