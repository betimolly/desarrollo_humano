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
    
        
    searchpersonainstitucion = (pers_inst, txt_search) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchPersonaInstitucion`,
            headers: { 'content-type': 'application/json' },
            data: { pers_inst, txt_search }
        });
    };
    
        
    listabeneficiarios = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaBeneficiarios`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listafamiliares = (id_persona) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaFamiliares`,
            headers: { 'content-type': 'application/json' },
            data: { id_persona }
        });
    };
    
        
    listapersonas = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaPersonas`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    deletebeneficiarios = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteBeneficiarios`,
            headers: { 'content-type': 'application/json' },
            data: { data }
        });
    };
    
        
    deletepersonas = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeletePersonas`,
            headers: { 'content-type': 'application/json' },
            data: { data }
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

    
    savefamiliar = (familiar) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveFamiliar`,
            headers: { 'content-type': 'application/json' },
            data: { ...familiar }
        });
    };

    
    savebeneficiario = (beneficiario) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveBeneficiario`,
            headers: { 'content-type': 'application/json' },
            data: { ...beneficiario }
        });
    };
}

const conn = new ServiceConexion();
export default conn;