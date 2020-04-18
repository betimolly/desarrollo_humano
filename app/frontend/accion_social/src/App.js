import React from 'react';
import './App.css';
import Login from './paginas/Login';
import Home from './paginas/Home';
import Header from "./componentes/Header";
import { BrowserRouter, Switch } from 'react-router-dom';
import PrivateRoute from "./componentes/PrivateRoute";
import PublicRoute from "./componentes/PublicRoute1";
import PrivateLinkMenu from './componentes/PrivateLinkMenu';
import PublicLinkMenu from './componentes/PublicLinkMenu';
import Menu from './componentes/Menu';
import Profile from './componentes/Profile';
import Persona from './paginas/Persona';
import Institucion from './paginas/Institucion';
import Beneficiario from './paginas/Beneficiario';


class App extends React.Component{
    state = {
        loggedIn: false,
        //selected: ""    
    };

    handleLoggedIn = loggedIn => {
        this.setState({loggedIn});
        if (this.props.history) {
            this.props.history.push('/accion_social');
        }
    };

    handleLoggedOut = location => {
        this.setState({loggedIn : false});
        sessionStorage.clear();
        window.location.href = '/accion_social';        
    };

    /*onSelect = selected => {
        this.setState({selected : selected});  
        window.location.href = '/accion_social/' + selected;      
    };*/

    componentDidMount() {
        sessionStorage.clear();
    }

    render () {
        const {loggedIn}=this.state;
        return (
            <div>

                <Header className="App-header" />

                <BrowserRouter>
                    <div>
                        <div className="header">
                            <PublicLinkMenu activeClassName="active" urlto="/accion_social/login" texttourl="Ingreso" loggedIn />
                            <PrivateLinkMenu activeClassName="active" exact urlto="/accion_social" texttourl="Principal" loggedIn />
                            <a onClick={this.handleLoggedOut} style={{cursor:"pointer", display : (loggedIn) ? ("inline-block") : ("none") }} >Salir</a>
                            <Profile loggedIn={loggedIn} />
                        </div>
                        <div style={{position: "relative", height: "calc(100vh - 50px)"}}>

                            <Menu loggedIn={loggedIn}  />  {/*onSelect={this.onSelect}*/}

                            <div className="content" >
                                <Switch>
                                    <PrivateRoute exact path="/accion_social" component={Home} />
                                    <PublicRoute path="/accion_social/login">
                                        <Login onLoggedIn={this.handleLoggedIn }/>
                                    </PublicRoute>
                                    <PrivateRoute exact path="/accion_social/personas" component={Persona} />
                                    <PrivateRoute exact path="/accion_social/instituciones" component={Institucion} />
                                    <PrivateRoute exact path="/accion_social/agregar_beneficiario" component={Beneficiario} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>               
            </div>
        );
    }
}

export default App;
