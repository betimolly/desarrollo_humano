import React from "react";
import { Button, TextField, MenuItem, Grid, Tabs, Tab , AppBar, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
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

        options_barrios: [],
        options_pers: [],

        dialog_title: '',
        dialog_context: '',
        open: false
    };

    searchPersona = (e) => {
        if (e.target.value.length >= 4) {
            conn.searchpersona(e.target.value).then( response => {
                if (!response.data.error) {
                    this.setState({ options_pers : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersona = (e, newValue) => {
        this.setState({id_responsable: newValue.id, responsable: newValue.ndoc+' - '+newValue.nombre+' '+newValue.apellido})
    }
    
    searchBarrio = (e) => {
        if (e.target.value.length >= 4) {
            conn.searchbarrio(e.target.value).then( response => {
                if (response.data.error) {
                    this.setState({error : response.data.error});
                }
                else {
                    this.setState({ options_barrios : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangeBarrio = (e, newValue) => {
        this.setState({id_barrio: newValue.num, barrio: newValue.barrio})
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


    render() {
        
        const { options_pers, options_barrios } = this.state;

        return (
            <div className="App">
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.state.dialog_title}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">{this.state.dialog_content}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary" autoFocus>
                        Aceptar
                    </Button>
                    </DialogActions>
                </Dialog>
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Institución</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                {/*<form onSubmit={this.handleSubmit}>*/}
                                <Grid item xs={6}>
                                    <TextField id="txtInstitucion" fullWidth name="institucion" label="Nombre Institución" value={this.state.institucion} onChange={e => this.setState({ institucion: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtCuit" fullWidth name="cuit" label="CUIL / CUIT" value={this.state.cuit} onChange={e => this.setState({ cuit: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="ddlActividad" fullWidth select name="actividad" className="labelleft" label="Actividad" value={this.state.actividad} onChange={e => this.setState({ actividad: e.target.value })} >
                                        <MenuItem value="Comedor Comunitario">Comedor Comunitario</MenuItem>
                                        <MenuItem value="Biblioteca">Biblioteca</MenuItem>
                                        <MenuItem value="Otros">Otros</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={this.state.telefono} onChange={e => this.setState({ telefono: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtEmail" fullWidth name="email" label="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtCalle" fullWidth name="calle" label="Calle" value={this.state.calle} onChange={e => this.setState({ calle: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtAltura" fullWidth name="altura" label="Altura" value={this.state.altura} onChange={e => this.setState({ altura: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        autoComplete={true}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        onChange={this.autocompleteChangeBarrio}
                                        getOptionLabel={option => option.barrio}
                                        renderInput={params => (
                                            <TextField {...params} id="txtBarrio" name="barrio" label="Barrio" fullWidth value={this.state.barrio} onChange={this.searchBarrio}  />)}
                                        options={options_barrios} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small> 
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        autoComplete={true}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        onChange={this.autocompleteChangePersona}
                                        getOptionLabel={option => option.ndoc ? option.ndoc.toString() + ' - ' + option.nombre + ' ' + option.apellido : '' }
                                        renderInput={params => (
                                            <TextField {...params} id="txNdoc" name="ndoc" label="Nro. Documento del Responsable de la Institución" fullWidth value={this.state.ndoc}  onChange={this.searchPersona}  />)}
                                        options={options_pers} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                </Grid> 
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                                {/*</form>*/}
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Institucion;