import React from "react";
import { Button, TextField, MenuItem, Grid } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "./ModalConfirmacion";
import conn from '../ServiceConexion';


class PersonaDatos extends React.Component {

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
        barrio: '',
        profesion: '',

        options_pers: [],
        options_barrios: [],
        dialog_title: '',
        dialog_content: '',

        open: false
    };

    getNewPerson = (nrodoc='') => {
        return {id: 0, 
                nombre: '',
                apellido: '',
                ndoc: nrodoc,
                fecha_nacimiento: '',
                telefono: '',
                email: '',
                calle: '',
                altura: '',
                barrio: '',
                profesion: ''};
    }

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };
    
    handleChangeBarrios = (e) => {
        this.setState( {barrio: e.target.value} );
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
                if (this.props.afterSavePersona) {
                    this.props.afterSavePersona(response.data.id);
                }               
            }
         })
        .catch( error => { console.error(error) } );
    };


    searchPersona = (e, nrodoc) => {
        this.setState({ndoc: nrodoc});

        if (nrodoc.length >= 4) {
            conn.searchpersona(nrodoc).then( response => {
                //Si no existe registro que coincida con el nrodoc, dejo entonces el valor que se escribió, porque es un alta
                if (response.data.error) {
                    this.setState({ options_pers: [this.getNewPerson(nrodoc)] });
                }
                else {
                    this.setState({ options_pers : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersona = (e, newValue) => {
        this.setState({...newValue});
        if ((newValue !== null) && this.props.onChangePersona) {
            this.props.onChangePersona(newValue.id);
        }
    }

  /*  searchBarrio = (e) => {
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
    }*/

    
    componentDidMount() {
        
        conn.loadbarrios().then( response => { 
            this.setState( { options_barrios: response.data } );
        });

        //Verifico si es una edición
        if (this.props.id_pers) {
            conn.searchexactperson(this.props.id_pers).then( response => { 
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( { options_pers: response.data,
                                     id: data.id, 
                                     nombre: data.nombre,
                                     apellido: data.apellido,
                                     ndoc: data.ndoc,
                                     fecha_nacimiento: data.fecha_nacimiento,
                                     telefono: data.telefono,
                                     email: data.email,
                                     calle: data.calle,
                                     altura: data.altura,
                                     barrio: data.barrio,
                                     profesion: data.profesion} );
                }
            });
        }
    }


    render() {
        return (
            <React.Fragment >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Agregar {this.props.titulo}</h2>
                    </Grid>
                    <Grid container spacing={3} item xs={12}>
                        <Grid item xs={6}>
                            <Autocomplete
                                inputValue={this.state.ndoc}
                                onInputChange={this.searchPersona}
                                loadingText='Cargando...'
                                noOptionsText ="Sin datos"
                                onChange={this.autocompleteChangePersona}
                                getOptionLabel={option => option.ndoc ? option.ndoc.toString() : '' }
                                renderInput={params => (
                                    <TextField {...params} id="txtNdoc" name="ndoc" label="Nro. Documento" fullWidth  />)}
                                options={this.state.options_pers} />
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
                            <TextField select fullWidth
                                label="Seleccione Barrio"
                                id="ddlBarrios"
                                className="labelleft"
                                value={this.state.barrio}
                                onChange={this.handleChangeBarrios}
                                >
                                {
                                    this.state.options_barrios.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }
                            </TextField>   
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="ddlSituacionLaboral" select fullWidth name="profesion" label="Situación Laboral" className="labelleft" value={this.state.profesion} onChange={e => this.setState({ profesion: e.target.value })} >
                                <MenuItem value="Activo">Activo</MenuItem>
                                <MenuItem value="Jubilado">Jubilado</MenuItem>
                                <MenuItem value="Pensionado">Pensionado</MenuItem>
                                <MenuItem value="Desocupado">Desocupado</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item container justify="flex-start" xs={12}>
                            <Button variant="contained" color="primary" onClick={this.handleFormSubmit} >Guardar</Button>
                        </Grid>
                    </Grid>                    
                </Grid>
            </React.Fragment>
        )
    }
}

export default PersonaDatos;