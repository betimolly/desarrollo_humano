import React from "react";
import { Button, TextField, MenuItem, Grid, Tabs, Tab , AppBar, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import TabPanel from '../componentes/TabPanel';
import { Autocomplete } from "@material-ui/lab";
import conn from '../ServiceConexion';

class Persona extends React.Component {
    /*constructor(props){
        super(props);
        this.state = {
            id: 0,
            nombre: '',
            apellido: '',
            ndoc: '',
            fecha_nacimiento: '',
            telefono: '',
            email: '',
            calle: '',
            altura: '',
            id_barrio: '',
            barrio: '',
            profesion: '',
    
            options_pers: [],
            options_barrios: [],
    
            tab_selected: 0,
            open: false
        };
    }*/
    state = {
        id: 0,
        nombre: '',
        apellido: '',
        ndoc: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        calle: '',
        altura: '',
        id_barrio: '',
        barrio: '',
        profesion: '',

        options_pers: [],
        options_barrios: [],
        dialog_title: '',
        dialog_context: '',

        tab_selected: 0,
        open: false
    };

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleFormSubmit = () => {
        conn.savepersona(this.state).then( response => {
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
                                nombre: '',
                                apellido: '',
                                ndoc: '',
                                fecha_nacimiento: '',
                                telefono: '',
                                email: '',
                                calle: '',
                                altura: '',
                                barrio: '',
                                profesion: ''});
            }
         })
        .catch( error => { console.error(error) } );
    };

    handleTab = (e, newval) => {
        this.setState ({tab_selected: newval});
    };

    searchPersona = (e) => {
        const nrodoc = e.target.value;
        if (e.target.value.length >= 4) {
            conn.searchpersona(e.target.value).then( response => {
                if (response.data.error) {
                    this.setState({ ndoc: nrodoc });
                }
                else {
                    this.setState({ options_pers : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersona = (e, newValue) => {
        this.setState({...newValue})
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

    

    render() {
        const { options_pers, options_barrios } = this.state;
        //const loading = open && options.length === 0;
      
        return (
            <div className="App" >
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
                        <AppBar position="static" color="transparent">
                            <Tabs
                                value={this.state.tab_selected}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={this.handleTab}
                            >
                                <Tab label="Persona" ></Tab>
                                <Tab label="Familiares" ></Tab>
                            </Tabs>
                        </AppBar>
                        <TabPanel value={this.state.tab_selected} index={0} >
                            <Grid container spacing={3} >
                                <Grid item container justify="flex-start" xs={12}>
                                    <h2>Agregar Persona</h2>
                                </Grid>
                                <Grid container spacing={3} item xs={12}>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            autoComplete={true}
                                            freeSolo
                                            loadingText='Cargando...'
                                            noOptionsText ="Sin datos"
                                            onChange={this.autocompleteChangePersona}
                                            getOptionLabel={option => option.ndoc ? option.ndoc.toString() : '' }
                                            renderInput={params => (
                                                <TextField {...params} id="txNdoc" name="ndoc" label="Nro. Documento" fullWidth value={this.state.ndoc}  onChange={this.searchPersona}  />)}
                                            options={options_pers} />
                                            <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id="txtNombre" fullWidth name="nombre" label="Nombre" value={this.state.nombre} onChange={e => this.setState({ nombre: e.target.value })} ></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id="txtApellido" fullWidth name="apellido" label="Apellido" value={this.state.apellido} onChange={e => this.setState({ apellido: e.target.value })} ></TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id="txtFechaNacimiento" fullWidth name="fecha_nacimiento" label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha_nacimiento} onChange={e => this.setState({ fecha_nacimiento: e.target.value })} ></TextField>
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
                                            freeSolo
                                            loadingText='Cargando...'
                                            noOptionsText ="Sin datos"
                                            onChange={this.autocompleteChangeBarrio}
                                            getOptionLabel={option => option.barrio}
                                            renderInput={params => (
                                                <TextField {...params} id="txtBarrio" name="barrio" label="Barrio" fullWidth value={this.state.barrio} onChange={this.searchBarrio}  />)}
                                            options={options_barrios} />
                                            <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>        
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id="ddlSituacionLaboral" select fullWidth name="profesion" label="Situación Laboral" className="labelleft" value={this.state.profesion} onChange={e => this.setState({ profesion: e.target.value })} >
                                            <MenuItem value="Activo">Activo</MenuItem>
                                            <MenuItem value="Jubilado">Jubilado</MenuItem>
                                            <MenuItem value="Pensionado">Pensionado</MenuItem>
                                            <MenuItem value="Desocupado">Desocupado</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item container justify="flex-start" xs={12}>
                                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit} >Guardar</Button>
                                    </Grid>
                                </Grid>                    
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.tab_selected} index={1} >
                            ALGO
                        </TabPanel>
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;