import React from 'react';
import { getUser } from '../utils/Commons';

class Home extends React.Component {

    handleLogout = () => {
        this.props.history.push('/login');
    }

    render() {
        return (
            <div>
                Bienvenido,  {getUser()} !<br/><br/>
                {/*<input type="button" onClick={this.handleLogout} value="Logout"/>*/}
            </div>
        );
    }
}

export default Home;