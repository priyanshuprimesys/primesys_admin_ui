
import LoginLayout from '../auth/AuthLayout';
import AdminLayout from '../app/AppLayout';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../../../contexts/AuthLayout/AuthenticationContext/AuthenticationContext';
import { authToken } from '../../../../api/services/AuthService';
import Loader from '../../../../global/components/loader/Loader';



const Main = () => {

    const { isAuthenticated, SetIsAuthenticated } = useContext(AuthenticationContext);
    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        const authenticationToken = localStorage.getItem(authToken);
        setShowLoader(true);
        try {
            if (authenticationToken === null) {
                SetIsAuthenticated(false);
                setShowLoader(false);
            } else if (authenticationToken != null) {
                SetIsAuthenticated(true);
                setShowLoader(false);
            }
        } catch (error) {
            if (authenticationToken === null) {
                setShowLoader(false);
            }

        } finally {
            setShowLoader(false);
        }
    }, []);





    return (
        <>
        {
            showLoader ? 
            <Loader/>
            :
            isAuthenticated ?
            <AdminLayout/>
            :
            <LoginLayout/>
        }
        </>
    )
}


export default Main;