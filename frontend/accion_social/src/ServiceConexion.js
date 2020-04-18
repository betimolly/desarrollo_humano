import axios from 'axios';

class ServiceConexion {
    apiurl = process.env.REACT_APP_API_URL;

    login = (usuario, clave) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/Login`,
            headers: { 'content-type': 'application/json' },
            data: { user: usuario, pass: clave }
        });
    };
    
        
    searchpersona = (nrodoc) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchPersona`,
            headers: { 'content-type': 'application/json' },
            data: { nrodoc }
        });
    };
    
        
    searchbarrio = (nombre) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchBarrio`,
            headers: { 'content-type': 'application/json' },
            data: { nombre }
        });
    };


    savepersona = (persona) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SavePersona`,
            headers: { 'content-type': 'application/json' },
            data: { ...persona }
        });
    };


    saveinstitucion = (institucion) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveInstitucion`,
            headers: { 'content-type': 'application/json' },
            data: { ...institucion }
        });
    };
}

const conn = new ServiceConexion();
export default conn;