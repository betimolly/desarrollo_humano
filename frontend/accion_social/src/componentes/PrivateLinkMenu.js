import React from 'react';
import { NavLink } from 'react-router-dom';
import { getToken } from '../utils/Commons';

class PrivateLinkMenu extends React.Component{
    render () {
        const { urlto, texttourl, loggedIn, ...rest } = this.props;
        return (
              getToken() && loggedIn  ?  <NavLink {...rest} to={urlto}>{texttourl}</NavLink>  :  ""
        );
    }
}

export default PrivateLinkMenu;