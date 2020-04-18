import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../utils/Commons';

// handle the private routes
function PublicRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/accion_social' }} />}
        />
    )
}

export default PublicRoute;