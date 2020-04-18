
import React from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHandsHelping, faLandmark } from '@fortawesome/free-solid-svg-icons'


class Menu extends React.Component{ 

    render () {
        const { loggedIn } = this.props;

        if (loggedIn) {
            return (
                <SideNav
                    onSelect={(selected) => {
                        this.props.onSelect(selected);
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
                            <NavItem eventKey="charts/linechart">
                                <NavText>
                                    Agregar Beneficiario
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="charts/barchart">
                                <NavText>
                                    Agregar Familiar
                                </NavText>
                            </NavItem>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            );

        }
        else {
            return "";
        }
    }

}

export default Menu;