import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAllowed } from '../utils/Commons';

// handle the private routes
function PrivateRoute({ component: Component, path, ...rest }) {
    return (
        <Route
            path = {path}
            {...rest}
            render={(props) => isAllowed(path) ? <Component {...props} /> : <Redirect to={{ pathname: '/desarrollo_humano/login', state: { from: props.location } }} />}
        />
    )
}

export default PrivateRoute;