import React from 'react';
import './App.css';
import Login from './paginas/Login';
import Home from './paginas/Home';
import Header from "./componentes/Header";
//import { getAllowed } from './utils/Commons';
import { BrowserRouter, Switch } from 'react-router-dom';
import PrivateRoute from "./componentes/PrivateRoute";
import PublicRoute from "./componentes/PublicRoute";
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
import ListaOrdenesCompras from './paginas/ListaOrdenesCompras';
import OrdenCompra from './paginas/OrdenCompra';
import ListaFacturasProveedores from './paginas/ListaFacturasProveedores';
import FacturaProveedor from './paginas/FacturaProveedor';


class App extends React.Component{
    state = {
        loggedIn: false
    };

    handleLoggedIn = loggedIn => {
        this.setState({loggedIn});
        if (this.props.history) {
            this.props.history.push('/desarrollo_humano');
        }
    };

    handleLoggedOut = location => {
        this.setState({loggedIn : false});
        sessionStorage.clear();
        window.location.href = '/desarrollo_humano';        
    };

    componentDidMount() {
        sessionStorage.clear();
    }

    /*getRoute = hijo => {
        const Components = {
            persona: Persona,
            institucion: Institucion,
            beneficiario: Beneficiario,
            familiar: Familiar,
            listabeneficiarios: ListaBeneficiarios,
            listapersonas: ListaPersonas,
            listainstituciones: ListaInstituciones,
            articulo: Articulo,
            listaarticulos: ListaArticulos,
            proveedor: Proveedor,
            listaproveedores: ListaProveedores,
            listaordenescompras: ListaOrdenesCompras,
            ordencompra: OrdenCompra,
            listafacturasproveedores: ListaFacturasProveedores,
            facturaproveedor: FacturaProveedor
        };
        return React.createElement(Components[hijo.componente], {key: hijo.id});
    }*/

    render () {
        const {loggedIn}=this.state;
        //const allowed=getAllowed();
        return (
            <div>

                <Header className="App-header" />

                <BrowserRouter>
                    <div>
                        <div className="header">
                            <PublicLinkMenu activeClassName="active" urlto="/desarrollo_humano/login" texttourl="Ingreso" loggedIn />
                            <PrivateLinkMenu activeClassName="active" exact urlto="/desarrollo_humano" texttourl="Principal" loggedIn />
                            <a onClick={this.handleLoggedOut} href="/desarrollo_humano" style={{cursor:"pointer", display : (loggedIn) ? ("inline-block") : ("none") }} >Salir</a>
                            <Profile loggedIn={loggedIn} />
                        </div>
                        <div style={{position: "relative", height: "calc(100vh - 50px)"}}>

                            <Menu loggedIn={loggedIn}  /> 

                            <div className="content" >
                                <Switch>
                                    <PrivateRoute exact path="/desarrollo_humano" component={Home} />
                                    <PublicRoute path="/desarrollo_humano/login">
                                        <Login onLoggedIn={this.handleLoggedIn }/>
                                    </PublicRoute>
                                    {/*{
                                       allowed && allowed.length > 0 && allowed.map(data=>data.hijos.map( hijo =>
                                            hijo.componente && <PrivateRoute key={hijo.id} exact path={hijo.pagina} component={this.getRoute(hijo)} />
                                        ) )
                                    }*/}
                                    
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_persona/:pers?" component={Persona} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_familiar" component={Familiar} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_personas" component={ListaPersonas} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_instituciones" component={ListaInstituciones} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_institucion/:inst?" component={Institucion} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_beneficiarios" component={ListaBeneficiarios} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_beneficiario/:t?/:ben?" component={Beneficiario} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_articulos" component={ListaArticulos} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_articulo/:art?" component={Articulo} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_proveedores" component={ListaProveedores} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_proveedor/:prov?" component={Proveedor} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_ordenes_compra" component={ListaOrdenesCompras} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_orden_compra/:oc?" component={OrdenCompra} />
                                    <PrivateRoute exact path="/desarrollo_humano/lista_facturas_proveedores" component={ListaFacturasProveedores} />
                                    <PrivateRoute exact path="/desarrollo_humano/agregar_factura/:fac?" component={FacturaProveedor} />
                                
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
