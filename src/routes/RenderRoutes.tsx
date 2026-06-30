import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import {
    useContext,
    useEffect,
    useState,
} from "react";

import { navigationRoutes } from "./RouteNavigation";

import { AuthenticationContext } from "../contexts/AuthLayout/AuthenticationContext/AuthenticationContext";

import Loader from "../global/components/loader/Loader";

import AuthService from "../api/services/AuthService";

const RenderRoutes = () => {

    const {
        isAuthenticated,
        SetIsAuthenticated,
    } = useContext(AuthenticationContext);

    const [showLoader, setShowLoader] =
        useState(true);

    useEffect(() => {

        const checkAuthentication =
            async () => {

                try {

                    const authenticationToken =
                        await AuthService.checkAuthUser();

                    SetIsAuthenticated(
                        authenticationToken === true
                    );

                } catch (error) {

                    SetIsAuthenticated(false);

                } finally {

                    setShowLoader(false);

                }
            };

        checkAuthentication();

    }, []);

    const renderRoutes = (routes: any[]) => {

        return routes.map((route, index) => {

            /* PRIVATE CHECK */

            if (
                route.isPrivate &&
                !isAuthenticated
            ) {

                return (
                    <Route
                        key={index}
                        path="*"
                        element={
                            <Navigate to="/" />
                        }
                    />
                );
            }

            /* ROUTE WITH CHILDREN */

            if (
                route.children &&
                route.children.length > 0
            ) {

                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    >

                        {renderRoutes(
                            route.children
                        )}

                    </Route>
                );
            }

            /* NORMAL ROUTE */

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                />
            );
        });
    };

    if (showLoader) {
        return <Loader />;
    }

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >

            <Routes>

                {renderRoutes(
                    navigationRoutes
                )}

            </Routes>

        </BrowserRouter>
    );
};

export default RenderRoutes;
