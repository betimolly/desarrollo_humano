import React from 'react';
import { getUser } from '../utils/Commons';

class Profile extends React.Component {

    handleLogout = () => {
        this.props.history.push('/login');
    }

    render() {
        const { loggedIn } = this.props;

        if (loggedIn) {
            return (
                <div style={{float: "right"}}>
                    Bienvenido,  {getUser()} !
                </div>
            );
        }
        else {
            return "";
        }
    }
}

export default Profile;