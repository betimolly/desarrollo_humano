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
    
        
    searchsimplepersona = (nrodoc) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchSimplePersona`,
            headers: { 'content-type': 'application/json' },
            data: { nrodoc }
        });
    };
    

    searchexactpersona = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchExactPersona`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    

    searchexactarticulo = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchExactArticulo`,
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
    
        
    searchexactpersonainstitucion = (pers_inst, tipo) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchExactPersonaInstitucion`,
            headers: { 'content-type': 'application/json' },
            data: { pers_inst, tipo }
        });
    };
    

    searchexactinstitucion = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchExactInstitucion`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
 /*       
    searchbarrio = (txt_search) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchBarrio`,
            headers: { 'content-type': 'application/json' },
            data: { txt_search }
        });
    };
 */   

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
    
        
    searcharticulosOC = (txt_search, id_oc, txt_oc) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchArticulosOC`,
            headers: { 'content-type': 'application/json' },
            data: {txt_search, id_oc, txt_oc}
        });
    };
    
        
    searchordencompra = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchOrdenCompra`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    searchfactura = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchFactura`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    searchbeneficiario = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchBeneficiario`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    

    searchsituacionhabitacional = (id_ben) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SearchSituacionHabitacional`,
            headers: { 'content-type': 'application/json' },
            data: { id_ben }
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
    
        
    loadproveedores = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadProveedores`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loadordenescompras = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadOrdenesCompras`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    loaddetalleOC = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadDetalleOC`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    loadFilesFromLegajo = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadFilesFromLegajo`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };
    
        
    loadpaises = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/LoadPaises`,
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
    
        
    listafamiliaresbenef = (id_persona) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaFamiliaresBenef`,
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
    
        
    listaordenescompras = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaOrdenesCompra`,
            headers: { 'content-type': 'application/json' }
        });
    };
    
        
    listafacturas = () => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ListaFacturas`,
            headers: { 'content-type': 'application/json' }
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
    
        
    deletebeneficiarios = (data, lista) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteBeneficiarios`,
            headers: { 'content-type': 'application/json' },
            data: { data, lista }
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

        
    /*deleteordenescompra = (data) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteOrdenesCompra`,
            headers: { 'content-type': 'application/json' },
            data: { data }
        });
    };*/

        
    deletefile = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteFile`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };

        
    deletefamiliar = (id) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/DeleteFamiliar`,
            headers: { 'content-type': 'application/json' },
            data: { id }
        });
    };

        
    uploadfileserver = (id, name, file) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/UploadFileServer`,
            headers: { 'content-type': 'application/json' },
            data: { id, name, file }
        });
    };

        
    modifydescriptionfile = (id, name) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/ModifyDescriptionFile`,
            headers: { 'content-type': 'application/json' },
            data: { id, name }
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

    
    saveordencompra = (oc) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveOrdenCompra`,
            headers: { 'content-type': 'application/json' },
            data: { ...oc }
        });
    };

    
    savefactura = (fac) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveFactura`,
            headers: { 'content-type': 'application/json' },
            data: { ...fac }
        });
    };

    
    savesituacionhabitacional = (sit) => {
        return axios({
            method: 'post',
            url: `${this.apiurl}/SaveSituacionHabitacional`,
            headers: { 'content-type': 'application/json' },
            data: { ...sit }
        });
    };
}

const conn = new ServiceConexion();
export default conn;