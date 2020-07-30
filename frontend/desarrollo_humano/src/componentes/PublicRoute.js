import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../utils/Commons';

// handle the private routes
class PublicRoute extends React.Component {
    render(){
        const { children: Children, ...rest } = this.props;
        return (
            <Route {...rest} render={(props) => !getToken() ? this.props.children : <Redirect to={{ pathname: '/desarrollo_humano' }} />} />

        );
    }
}

export default PublicRoute;