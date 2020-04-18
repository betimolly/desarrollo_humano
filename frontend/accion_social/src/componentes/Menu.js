
import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHandsHelping, faLandmark } from '@fortawesome/free-solid-svg-icons'
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
                                    </NavItem>
                                    <NavItem eventKey="instituciones">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faLandmark} />
                                        </NavIcon>
                                        <NavText>
                                            Instituciones
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="beneficiarios">
                                        <NavIcon>
                                            <FontAwesomeIcon icon={faHandsHelping} />
                                        </NavIcon>
                                        <NavText>
                                            Beneficiarios
                                        </NavText>
                                        <NavItem eventKey="agregar_beneficiario">
                                            <NavText>
                                                Agregar Beneficiario
                                            </NavText>
                                        </NavItem>
                                        <NavItem eventKey="agregar_familiar">
                                            <NavText>
                                                Agregar Familiar
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