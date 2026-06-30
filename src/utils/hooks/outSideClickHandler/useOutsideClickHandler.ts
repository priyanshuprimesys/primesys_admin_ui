import { useEffect, useRef, useState } from "react";





function useOutsideClickHandler<T extends HTMLElement>(intialValue:boolean){
    const [isComponentVisible, SetIsComponentVisible] = useState<boolean>(intialValue);
    const ref = useRef<T>(null);

    const handleClickOutside = (event: MouseEvent) =>{
        if(ref.current && !ref.current.contains(event?.target as Node)){
            SetIsComponentVisible(false);
        }
    }

    useEffect(()=>{
        document.addEventListener('click',handleClickOutside);
        return () =>{
            document.removeEventListener('click',handleClickOutside);
        }
    },[]);


    return {ref,isComponentVisible,SetIsComponentVisible}
}



export {useOutsideClickHandler};