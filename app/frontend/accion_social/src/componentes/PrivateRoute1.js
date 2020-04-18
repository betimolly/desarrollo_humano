import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../utils/Commons';

// handle the private routes
class PrivateRoute1 extends React.Component {
    render(){
        const { children: Children, ...rest } = this.props;
        return (
            <Route {...rest} render={(props) => getToken() ? this.props.children : <Redirect to={{ pathname: '/accion_social/login' , state: { from: props.location }}} />} />

        );
    }
}

export default PrivateRoute1;