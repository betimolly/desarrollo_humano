import React from "react";
import Logo from "../imagenes/escudo.png";

class Header extends React.Component {
    render() {
        return (
            <div className="App-header">
                <div>
                    <img className="logo-header" src={Logo} alt="Logo" />
                    <strong className="title-header">Municipalidad de Cipolletti</strong>
                </div>
            </div>
        );
    }
}
export default Header;