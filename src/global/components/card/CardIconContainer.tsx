import { Link } from "react-router-dom";


interface CardIconProps{
    color:string | null;
    icon:JSX.Element | null;
    name:string,
    innerPath:string;
}




const CardIconContainer: React.FC<CardIconProps> = ({color,name,icon,innerPath}) =>{

 
    return(
        <>
            <div className={`bg-black w-[20vw] rounded-lg px-4 py-4 my-3 overflow-hidden ${color != null ? color :'bg-theme-darkBlue'}`}>
                <p className="pb-4 text-theme-lightGray">{name}</p>
                <div className="mb-2">{icon}</div>
                <Link className="mt-4 underline text-theme-cardLinkColor" to={innerPath}>Go to {name}</Link>
            </div>
        </>
    )
}



export default CardIconContainer;