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
import Familiar from './paginas/Familiar';
import ListaBeneficiarios from './paginas/ListaBeneficiarios';
import ListaPersonas from './paginas/ListaPersonas';
import ListaInstituciones from './paginas/ListaInstituciones';
import Articulo from './paginas/Articulo';
import ListaArticulos from './paginas/ListaArticulos';
import Proveedor from './paginas/Proveedor';
import ListaProveedores from './paginas/ListaProveedores';


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
                            <a onClick={this.handleLoggedOut} href="/accion_social" style={{cursor:"pointer", display : (loggedIn) ? ("inline-block") : ("none") }} >Salir</a>
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
                                    <PrivateRoute exact path="/accion_social/agregar_persona/:pers?" component={Persona} />
                                    <PrivateRoute exact path="/accion_social/agregar_familiar" component={Familiar} />
                                    <PrivateRoute exact path="/accion_social/lista_personas" component={ListaPersonas} />
                                    <PrivateRoute exact path="/accion_social/lista_instituciones" component={ListaInstituciones} />
                                    <PrivateRoute exact path="/accion_social/agregar_institucion" component={Institucion} />
                                    <PrivateRoute exact path="/accion_social/lista_beneficiarios" component={ListaBeneficiarios} />
                                    <PrivateRoute exact path="/accion_social/agregar_beneficiario" component={Beneficiario} />
                                    <PrivateRoute exact path="/accion_social/agregar_articulo/:art?" component={Articulo} />
                                    <PrivateRoute exact path="/accion_social/lista_articulos" component={ListaArticulos} />
                                    <PrivateRoute exact path="/accion_social/agregar_proveedor/:prov?" component={Proveedor} />
                                    <PrivateRoute exact path="/accion_social/lista_proveedores" component={ListaProveedores} />
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
