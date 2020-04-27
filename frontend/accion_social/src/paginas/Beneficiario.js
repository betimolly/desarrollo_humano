import React from "react";
import { Button, TextField, Grid, MenuItem, Card, CardContent } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class Beneficiario extends React.Component {
    
    state = {
        id: 0,
        es_persona_institucion: '',
        id_pers_inst: '',
        nombre: '',
        es_beneficiario_1: '',
        es_beneficiario_2: '',
        es_beneficiario_3: '',
        tipo_beneficio_1: '',
        tipo_beneficio_2: '',
        tipo_beneficio_3: '',
        tipo_modulo: '',
        entregado: true,
        fecha_alta: '',
        observaciones: '',

        tipos_de_beneficiarios_1: [],
        tipos_de_beneficiarios_2: [],
        tipos_de_beneficiarios_3: [],
        lista_personas_instituciones: [],
        
        dialog_title: '',
        dialog_content: '',
        open: false
    };

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleChangeTipo = (e) => {
        this.setState({es_persona_institucion: e.target.value, lista_personas_instituciones: []});
    };

    searchPersonaInstitucion = (e) => {
        if (e.target.value.length >= 4) {
            conn.searchpersonainstitucion(this.state.es_persona_institucion, e.target.value).then( response => {
                if (!response.data.error) {
                    this.setState({ lista_personas_instituciones : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersonaInstitucion = (e, newValue) => {
        this.setState({id_pers_inst: newValue.numero, nombre: newValue.descripcion})
    }
    

    handleChangeBeneficiario = (e) => {
        const es_beneficiario = e.target.value;
        const key = e.target.name;
        const keyParts = key.split('_');
        const index = keyParts[keyParts.length - 1];
        const keyTipos = 'tipos_de_beneficiarios_'+index;

        let tipos_de_beneficiarios;

        switch (es_beneficiario) {
            case "NO": tipos_de_beneficiarios = [{clave: "No Corresponde", valor: "No Corresponde"}];
                break;
            case "MUNI": tipos_de_beneficiarios = [ {clave: "Beca Estudiantil", valor: "Beca Estudiantil"}, {clave: "Subsidio", valor: "Subsidio"}, {clave: "Otro", valor: "Otro"}];
                break;
            case "PROV": tipos_de_beneficiarios = [ {clave: "Subsidio", valor: "Subsidio"}, {clave: "Tarjeta Río Negro Presente", valor: "Tarjeta Río Negro Presente"}, {clave: "Siprove", valor: "Siprove"}, {clave: "Otro", valor: "Otro"}];
                break;
            case "NAC": tipos_de_beneficiarios = [ {clave: "Asignación Universal por Hijo", valor: "Asignación Universal por Hijo"}, {clave: "Discapacidad", valor: "Discapacidad"}, {clave: "Alimentar", valor: "Alimentar"}, {clave: "Progresar", valor: "Progresar"}, {clave: "Pensión", valor: "Pensión"}];
                break;
            default: ;
                break;
        }

        this.setState({[key]: es_beneficiario, [keyTipos]: tipos_de_beneficiarios});
    };

    handleFormSubmit = () => {
        conn.savebeneficiario(this.state).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error});
                this.setState({dialog_title : "Error"});
                this.setState({dialog_content : "Error al guardar o actualizar los datos."});
                this.handleClickOpen();
            }
            else {
                this.setState({dialog_title : "Confirmación"});
                this.setState({dialog_content : "Los datos se han guardado o actualizado correctamente."});
                this.handleClickOpen();
                this.setState({ id: 0,
                                es_persona_institucion: '',
                                id_pers_inst: '',
                                nombre: '',
                                es_beneficiario_1: '',
                                es_beneficiario_2: '',
                                es_beneficiario_3: '',
                                tipo_beneficio_1: '',
                                tipo_beneficio_2: '',
                                tipo_beneficio_3: '',
                                fecha_alta: '',
                                observaciones: ''});
            }
         })
        .catch( error => { console.error(error) } );       
    };
    
    render() {
        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Beneficiario</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                {/*<form onSubmit={this.handleSubmit}>*/}
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Seleccione si es Persona o Institución"
                                        id="ddlTipoPersonaInstitucion"
                                        className="labelleft"
                                        value={this.state.es_persona_institucion}
                                        onChange={this.handleChangeTipo}
                                        >
                                        <MenuItem value={"persona"}>Persona</MenuItem>
                                        <MenuItem value={"institucion"}>Institución</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        autoComplete={true}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        onChange={this.autocompleteChangePersonaInstitucion}
                                        getOptionLabel={option => option.numero ? option.descripcion : '' }
                                        renderInput={params => (
                                            <TextField {...params} id="txtNumero" name="id_pers_inst" label="Seleccione DNI o CUIT" fullWidth value={this.state.id_pers_inst}  onChange={this.searchPersonaInstitucion}  />)}
                                                options={this.state.lista_personas_instituciones} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="¿Ha recibido algún tipo de beneficio?"
                                        id="ddlBeneficiario_1"
                                        className="labelleft"
                                        name="es_beneficiario_1"
                                        value={this.state.es_beneficiario_1}
                                        onChange={this.handleChangeBeneficiario}
                                        >
                                        <MenuItem value={"NO"}>No</MenuItem>
                                        <MenuItem value={"MUNI"}>Municipal</MenuItem>
                                        <MenuItem value={"PROV"}>Provincial</MenuItem>
                                        <MenuItem value={"NAC"}>Nacional</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Nombre del Beneficio"
                                        id="ddlTipoBeneficiario_1"
                                        className="labelleft"
                                        value={this.state.tipo_beneficio_1}
                                        onChange={e => { this.setState({tipo_beneficio_1: e.target.value})}}
                                        >
                                        {
                                            this.state.tipos_de_beneficiarios_1.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
                                </Grid> 
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        id="ddlBeneficiario_2"
                                        className="labelleft"
                                        name="es_beneficiario_2"
                                        value={this.state.es_beneficiario_2}
                                        onChange={this.handleChangeBeneficiario}
                                        >
                                        <MenuItem value={"NO"}>No</MenuItem>
                                        <MenuItem value={"MUNI"}>Municipal</MenuItem>
                                        <MenuItem value={"PROV"}>Provincial</MenuItem>
                                        <MenuItem value={"NAC"}>Nacional</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        id="ddlTipoBeneficiario_2"
                                        className="labelleft"
                                        value={this.state.tipo_beneficio_2}
                                        onChange={e => { this.setState({tipo_beneficio_2: e.target.value})}}
                                        >
                                        {
                                            this.state.tipos_de_beneficiarios_2.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
                                </Grid> 
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        id="ddlBeneficiario_3"
                                        className="labelleft"
                                        name="es_beneficiario_3"
                                        value={this.state.es_beneficiario_3}
                                        onChange={this.handleChangeBeneficiario}
                                        >
                                        <MenuItem value={"NO"}>No</MenuItem>
                                        <MenuItem value={"MUNI"}>Municipal</MenuItem>
                                        <MenuItem value={"PROV"}>Provincial</MenuItem>
                                        <MenuItem value={"NAC"}>Nacional</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        id="ddlTipoBeneficiario_3"
                                        className="labelleft"
                                        value={this.state.tipo_beneficio_3}
                                        onChange={e => { this.setState({tipo_beneficio_3: e.target.value})}}
                                        >
                                        {
                                            this.state.tipos_de_beneficiarios_3.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
                                </Grid> 
                                <Grid item xs={12}>
                                    <TextField
                                        id="txtObservaciones"
                                        label="Observaciones"
                                        multiline fullWidth
                                        rows={4}
                                        value={this.state.observaciones}
                                        onChange={e => { this.setState({observaciones: e.target.value})}}
                                    />                            
                                </Grid>  
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                                {/*</form>*/}
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card >    
            </div>
        )
    }
}

export default Beneficiario;