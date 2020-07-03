import React from "react";
import { Button, TextField, MenuItem, Grid, Card, CardContent } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class Institucion extends React.Component {
    state = {
        id: 0,
        institucion: '',
        cuit: '',
        actividad: '',
        telefono: '',
        email: '',
        calle: '',
        altura: '',
        id_barrio: '',
        barrio: '',
        id_responsable: '',
        responsable: '',

        barrio_obj: {id_barrio: '', barrio: ''},
        responsable_obj: {id_responsable: '', responsable: ''},
        options_barrios: [],
        options_pers: [],

        dialog_title: '',
        dialog_content: '',
        open: false
    };

    searchPersona = (e, resp) => {
        this.setState({responsable: resp});

        if (e.target.value.length >= 4) {
            conn.searchsimplepersona(e.target.value).then( response => {
                if (response.data.error) {
                    this.setState({ options_pers: [this.state.responsable_obj] });
                }
                else {
                    this.setState({ options_pers : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersona = (e, newValue) => {
        if (newValue !== null) {
            this.setState({id_responsable: newValue.id_responsable, responsable: newValue.responsable});
        }
    }
    
    
    //Al seleccionar el barrio del listado desplegado
    handleChangeBarrios = (e, newValue) => {
        this.setState( {id_barrio: newValue.clave, barrio: newValue.valor} );
    };

    //Al tipear el nombre del barrio
    onChangeBarrios = (e,newValue) => {
        this.setState({ barrio: newValue })
    }

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleFormSubmit = () => {
        conn.saveinstitucion(this.state).then( response => {
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
                this.setState({id: 0,
                                institucion: '',
                                cuit: '',
                                actividad: '',
                                telefono: '',
                                email: '',
                                calle: '',
                                altura: '',
                                id_barrio: '',
                                barrio: '',
                                id_responsable: '',
                                responsable: ''});
            }
         })
        .catch( error => { console.error(error) } );
    };


    componentDidMount() {
        conn.loadbarrios().then( response => { 
            this.setState( { options_barrios: response.data } );
        });

        if (this.props.match.params.inst) {
            conn.searchexactinstitucion(this.props.match.params.inst).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( {id: data.id,
                                    institucion: data.institucion,
                                    cuit: data.cuit,
                                    actividad: data.actividad,
                                    telefono: data.telefono,
                                    email: data.email,
                                    calle: data.calle,
                                    altura: data.altura,
                                    id_barrio: data.id_barrio,
                                    barrio: data.barrio,
                                    barrio_obj: {id_barrio: data.id_barrio, barrio: data.barrio},
                                    id_responsable: data.id_beneficiario,
                                    responsable: data.responsable,
                                    responsable_obj: {id_responsable: data.id_beneficiario, responsable: data.descripcion} } );

                }
            });
        }
    }


    render() {
        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Institución</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtInstitucion" fullWidth name="institucion" label="Nombre Institución" value={this.state.institucion} onChange={e => this.setState({ institucion: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtCuit" fullWidth name="cuit" label="CUIL / CUIT" value={this.state.cuit} onChange={e => this.setState({ cuit: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="ddlActividad" fullWidth select name="actividad" className="labelleft" label="Actividad" value={this.state.actividad} onChange={e => this.setState({ actividad: e.target.value })} >
                                        <MenuItem value="Comedor Comunitario">Comedor Comunitario</MenuItem>
                                        <MenuItem value="Biblioteca">Biblioteca</MenuItem>
                                        <MenuItem value="Otros">Otros</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={this.state.telefono} onChange={e => this.setState({ telefono: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtEmail" fullWidth name="email" label="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtCalle" fullWidth name="calle" label="Calle" value={this.state.calle} onChange={e => this.setState({ calle: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtAltura" fullWidth name="altura" label="Altura" value={this.state.altura} onChange={e => this.setState({ altura: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>      
                                    <Autocomplete
                                        inputValue={this.state.barrio}
                                        onChange={this.handleChangeBarrios}
                                        onInputChange={ this.onChangeBarrios }
                                        options={this.state.options_barrios}
                                        getOptionLabel={(option) => option.valor}
                                        renderInput={(params) => <TextField {...params} label="Barrio"  />}
                                        />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        autoComplete={true}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        value={this.state.responsable_obj}
                                        inputValue={this.state.responsable}
                                        onInputChange={this.searchPersona}
                                        onChange={this.autocompleteChangePersona}
                                        getOptionLabel={option => option.responsable }
                                        renderInput={params => (
                                            <TextField {...params} label="Nro. Documento del Responsable de la Institución" />)}
                                        options={this.state.options_pers} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                </Grid> 
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Institucion;