import React from "react";
import { Button, TextField, Grid, MenuItem, Card, CardContent } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import { getUserId, getRolId } from '../utils/Commons';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class SolicitudEntregaMercaderia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            es_persona_institucion: '',
            id_pers_inst: '',
            descripcion: '',
            tipo_beneficio: '',
            id_remito: '',
            estado: '1',
            fecha_emision: this.calcFechaHoy(),
            observaciones: '',
            efector: '',
            usuario: getUserId(),
            rol: getRolId(),
    
            tipos_estados: [],
            efectores: [],
            lista_personas_instituciones: [],
            pers_inst_obj: {id_pers_inst: '', descripcion: ''},
            
            dialog_title: '',
            dialog_content: '',
            open: false
        };
    }

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleChangeTipo = (e) => {
        this.setState({es_persona_institucion: e.target.value, lista_personas_instituciones: [] });
    };

    searchPersonaInstitucion = (e, pers_inst) => {
        this.setState({ descripcion : pers_inst});
        if (pers_inst.length >= 4) {
            conn.searchpersonainstitucion(this.state.es_persona_institucion, e.target.value).then( response => {
                if (!response.data.error) {
                    this.setState({ lista_personas_instituciones : response.data});
                }
            })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersonaInstitucion = (e, newValue) => {
        if (newValue !== null) {
            this.setState({id_pers_inst: newValue.numero, descripcion: newValue.descripcion});
            this.setState({pers_inst_obj: {id_pers_inst: newValue.numero, descripcion: newValue.descripcion} });
        }
    }
    
    calcFechaHoy = () => { 
        const hoy = new Date();
        const anio = hoy.getFullYear();
        let mes = hoy.getMonth() + 1;
        let dia = hoy.getDate();
        if (mes < 10) {
            mes = '0' + mes;
        }
        if (dia < 10) {
            dia = '0' + dia;
        }
        return dia + '-' + mes + '-' + anio;
    }

    handleFormSubmit = () => { 
        conn.savesolicitudbenef(this.state).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else { 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    id: 0,
                    es_persona_institucion: '',
                    id_pers_inst: '',
                    descripcion: '',
                    tipo_beneficio: '',
                    id_remito: '',
                    estado: '0',
                    fecha_emision: this.calcFechaHoy(),
                    observaciones: '',
                    efector: '',
                    usuario: getUserId(),
                    pers_inst_obj: {id_pers_inst: '', descripcion: ''}
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

  
    componentDidMount() {
        if (getRolId() === "3") { //Rol Administrativo
            this.setState({ tipos_estados: [ {clave: "2", valor: "Aprobada"}, {clave: "3", valor: "Entregada"} ] });
        }
        else {
            if (getRolId() === "2") { //Rol Beneficiario
                this.setState({ tipos_estados: [ {clave: "1", valor: "Solicitada"}, {clave: "2", valor: "Aprobada"} ] });
            }
            else { //Rol Administrador
                this.setState({ tipos_estados: [{clave: "1", valor: "Solicitada"}, {clave: "2", valor: "Aprobada"}, {clave: "3", valor: "Entregada"} ] });
            }
        }
        
        conn.loadefectores().then( response => { 
            this.setState( { efectores: response.data } );
        });

        if (this.props.match.params.id) {
            conn.searchsolicitud(this.props.match.params.id).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    const fecha = data.fecha_emision.split("-").reverse().join("-");
                    this.setState( { 
                                     id: data.id,
                                     id_pers_inst: data.id_pers_inst,
                                     es_persona_institucion: data.es_persona_institucion,
                                     tipo_beneficio: data.tipo_beneficio,
                                     id_remito: (data.id_remito !== "") ? data.id_remito : "",
                                     estado: data.estado,
                                     fecha_emision: fecha,
                                     descripcion: data.descripcion,
                                     observaciones: data.observaciones,
                                     efector: data.efector,
                                     pers_inst_obj: {id_pers_inst: data.id_pers_inst, descripcion: data.descripcion},
                                    } );
                }
            });
        }
    }

    
    render() {
        const rol = (getRolId() === "2") ? true : false;
        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Solicitud de Entrega de Mercadería</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                <Grid item sm={6} xs={12}>
                                    <TextField select fullWidth
                                        label="Seleccione si es Persona o Institución"
                                        id="ddlTipoPersonaInstitucion"
                                        className="labelleft"
                                        value={this.state.es_persona_institucion}
                                        onChange={this.handleChangeTipo}
                                        >
                                        <MenuItem value={"P"}>Persona</MenuItem>
                                        <MenuItem value={"I"}>Institución</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <Autocomplete
                                        autoComplete={true}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        value={this.state.pers_inst_obj}
                                        inputValue={this.state.descripcion}
                                        onChange={this.autocompleteChangePersonaInstitucion}
                                        onInputChange={this.searchPersonaInstitucion}
                                        getOptionLabel={option => option.descripcion }
                                        renderInput={params => (
                                            <TextField {...params} label="Seleccione DNI o CUIT" />)}
                                                options={this.state.lista_personas_instituciones} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField select fullWidth
                                        label="Tipo de beneficio"
                                        id="ddlTipoBeneficio"
                                        className="labelleft"
                                        name="tipo_beneficio"
                                        value={this.state.tipo_beneficio}
                                        onChange={e => { this.setState({tipo_beneficio: e.target.value})}}
                                        >
                                        <MenuItem value={"Alimentos"}>Alimentos</MenuItem>
                                        <MenuItem value={"Materiales"}>Materiales</MenuItem>
                                        <MenuItem value={"Monetario"}>Monetario</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField select fullWidth
                                        label="Efector"
                                        id="ddlEfector"
                                        className="labelleft"
                                        name="efector"
                                        value={this.state.efector}
                                        onChange={e => { this.setState({efector: e.target.value})}}
                                        >
                                        {
                                            this.state.efectores.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <TextField id="txtFechaEmision" fullWidth name="fecha_emision" label="Fecha Emisión" inputProps={{readOnly: true}} value={this.state.fecha_emision} ></TextField>
                                </Grid>
                                <Grid item sm={3} xs={12}>
                                    <TextField id="txtIdRemito" fullWidth name="id_remito" label="Número Remito" inputProps={{readOnly: rol}} value={this.state.id_remito} onChange={e => { this.setState({id_remito: e.target.value})}} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField select fullWidth
                                        label="Estado de la Solicitud"
                                        id="ddlEstado"
                                        className="labelleft"
                                        name="estado"
                                        value={this.state.estado}
                                        onChange={e => { this.setState({estado: e.target.value})}}
                                        >
                                        {
                                            this.state.tipos_estados.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
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
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card >    
            </div>
        )
    }
}

export default SolicitudEntregaMercaderia;