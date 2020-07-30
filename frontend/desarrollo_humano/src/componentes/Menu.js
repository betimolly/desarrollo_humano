
import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHandsHelping, faLandmark, faBoxOpen, faPeopleCarry } from '@fortawesome/free-solid-svg-icons'
import { Route } from 'react-router-dom';
import { getAllowed } from '../utils/Commons';


class Menu extends React.Component{ 
    
    getIcon = data => {
        
        const Components = {
            faUser: faUser,
            faHandsHelping: faHandsHelping,
            faLandmark: faLandmark,
            faBoxOpen: faBoxOpen,
            faPeopleCarry: faPeopleCarry
        };

        return <FontAwesomeIcon icon={Components[data.icono]} style={{ fontSize: '1.5em' }} />     
    };

    render () {
        const { loggedIn } = this.props;
        const allowed = getAllowed();

        if (loggedIn) {
            return (
                
                    <Route render={({ location, history }) => (
                        <React.Fragment>
                            <SideNav
                                onSelect={(selected) => {
                                    const to = '/desarrollo_humano/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                }}
                            >
                                <SideNav.Toggle />
                                <SideNav.Nav defaultSelected="personas">
                                    {
                                       allowed && allowed.length > 0 && allowed.map(data=> 
                                        <NavItem key={data.id} eventKey={data.nombre}>
                                            <NavIcon>
                                                {this.getIcon(data)}
                                            </NavIcon>
                                            <NavText>
                                                {data.menu}
                                            </NavText>
                                            {data.hijos.map(hijo => 
                                                <NavItem key={hijo.id} eventKey={hijo.nombre}>
                                                    <NavText>
                                                        {hijo.menu}
                                                    </NavText>
                                                </NavItem>
                                            )}
                                        </NavItem>    
                                        )
                                    }

                                    {/*
                                    <NavItem eventKey="personas">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.5em' }} />
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
                                            <FontAwesomeIcon icon={faLandmark} style={{ fontSize: '1.5em' }}  />
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
                                            <FontAwesomeIcon icon={faHandsHelping} style={{ fontSize: '1.5em' }}  />
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
                                            <FontAwesomeIcon icon={faPeopleCarry} style={{ fontSize: '1.5em' }}  />
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
                                        <NavItem eventKey="lista_ordenes_compra">
                                            <NavText>
                                                Listado Orden Compra
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_orden_compra">
                                            <NavText>
                                                Agregar Orden Compra
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="lista_facturas_proveedores">
                                            <NavText>
                                                Listado Facturas
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_factura">
                                            <NavText>
                                                Agregar Factura
                                            </NavText>
                                        </NavItem>
                                    </NavItem>
                                    <NavItem eventKey="articulos">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '1.5em' }}  />
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
                                </NavItem>*/}
                                </SideNav.Nav>
                            </SideNav>
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