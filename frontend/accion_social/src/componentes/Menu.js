
import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHandsHelping, faLandmark, faBoxOpen, faPeopleCarry } from '@fortawesome/free-solid-svg-icons'
import { Route } from 'react-router-dom';


class Menu extends React.Component{ 

    render () {
        const { loggedIn } = this.props;

        if (loggedIn) {
            return (
                
                    <Route render={({ location, history }) => (
                        <React.Fragment>
                            <SideNav
                                onSelect={(selected) => {
                                    const to = '/accion_social/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                }}
                            >
                                <SideNav.Toggle />
                                <SideNav.Nav defaultSelected="personas">
                                    <NavItem eventKey="personas">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faUser} />
                                        </NavIcon>
                                        <NavText>
                                            Personas
                                        </NavText>
                                        <NavItem eventKey="lista_personas">
                                            <NavText>
                                                Listado de Personas
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_persona">
                                            <NavText>
                                                Agregar Persona
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_familiar">
                                            <NavText>
                                                Agregar Familiar
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                    <NavItem eventKey="instituciones">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faLandmark} />
                                        </NavIcon>
                                        <NavText>
                                            Instituciones
                                        </NavText>
                                        <NavItem eventKey="lista_instituciones">
                                            <NavText>
                                                Listado de Instituciones
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_institucion">
                                            <NavText>
                                            Agregar Institución
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                    <NavItem eventKey="beneficiarios">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faHandsHelping} />
                                        </NavIcon>
                                        <NavText>
                                            Beneficiarios
                                        </NavText>
                                        <NavItem eventKey="lista_beneficiarios">
                                            <NavText>
                                                Listado de Beneficiarios
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_beneficiario">
                                            <NavText>
                                                Agregar Beneficiario
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                    <NavItem eventKey="proveedores">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faPeopleCarry} />
                                        </NavIcon>
                                        <NavText>
                                            Proveedores
                                        </NavText>
                                        <NavItem eventKey="lista_proveedores">
                                            <NavText>
                                                Listado de Proveedores
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_proveedores">
                                            <NavText>
                                                Agregar Proveedor
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                    <NavItem eventKey="articulos">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faBoxOpen} />
                                        </NavIcon>
                                        <NavText>
                                            Artículos
                                        </NavText>
                                        <NavItem eventKey="lista_articulos">
                                            <NavText>
                                                Listado de Artículos
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_articulo">
                                            <NavText>
                                                Agregar Artículo
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            {/*<main>
                                <Route path="/" exact component={props => <Home />} />
                                <Route path="/home" component={props => <Home />} />
                                <Route path="/devices" component={props => <Home />} />
                            </main>*/}
                        </React.Fragment>
                    )}
                    />
                
            );

        }
        else {
            return "";
        }
    }

}

export default Menu;