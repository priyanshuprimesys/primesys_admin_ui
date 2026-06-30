import RouteErrorCss from './styles/RouteErrorCss.module.css';
import ErrorImage from '../../../assets/images/ErrorImage.png';
import { Link } from 'react-router-dom';
import { IconsStore } from '../../Icons/IconsStore';




const RouteError = () =>{
    return (
        <>
            <div className={RouteErrorCss.errorContainer}>
                <div className={RouteErrorCss.errorContainerCard}>
                    <div>
                    <img src={ErrorImage} className='w-48 ' />
                    </div>
                    <div className='text-center'>
                        <p className='pb-4 m-0 text-base font-bold text-wrap'>Sorry we can't find that page</p>
                        <p className='m-0 text-xs '>
                            Oops! The page you are looking for doesn't exists. It might have been moved or deleted.
                            </p>
                    </div>
                    <div className='flex items-center gap-1 py-2 text-theme-linkColor'>
                        <Link to={'/'} className='font-medium'>Go Back To Home</Link>
                        {IconsStore.rightArrowLLink}
                    </div>
                </div>
            </div>
        </>
    )
}






export default RouteError;