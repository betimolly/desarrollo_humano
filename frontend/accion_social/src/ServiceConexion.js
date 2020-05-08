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
    

    searchexactperson = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchExactPersona`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    

    searcharticulo = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchArticulo`,
            headers: { 'content-type': 'application/json' },
            data: { id }
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
    

    searchproveedor = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchProveedor`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    searcharticulosmodulos = (txt_search) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchArticulosModulos`,
            headers: { 'content-type': 'application/json' },
            data: {txt_search}
        });
    };
    
        
    loadbarrios = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadBarrios`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadrubros = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadRubros`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadsubrubros = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadSubRubros`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    loadmarcas = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadMarcas`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadunidadmedida = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadUnidadMedida`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadenvases = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadEnvases`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadlocalidades = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadLocalidades`,
            headers: { 'content-type': 'application/json' }
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
    
        
    listainstituciones = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaInstituciones`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listapersonas = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaPersonas`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listaarticulos = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaArticulos`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listaproveedores = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaProveedores`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listaarticulosmodulo = (id_art) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaArticulosModulo`,
            headers: { 'content-type': 'application/json' },
            data: { id_art }
        });
    };
    
        
    deletearticulos = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteArticulos`,
            headers: { 'content-type': 'application/json' },
            data: { data }
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
    
        
    deleteinstituciones = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteInstituciones`,
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

        
    deleteproveedores = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteProveedores`,
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

    
    savearticulo = (articulo) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveArticulo`,
            headers: { 'content-type': 'application/json' },
            data: { ...articulo }
        });
    };

    
    saveproveedor = (proveedor) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveProveedor`,
            headers: { 'content-type': 'application/json' },
            data: { ...proveedor }
        });
    };

    
    savemoduloarticulos = (proveedor) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveModuloArticulos`,
            headers: { 'content-type': 'application/json' },
            data: { ...proveedor }
        });
    };
}

const conn = new ServiceConexion();
export default conn;