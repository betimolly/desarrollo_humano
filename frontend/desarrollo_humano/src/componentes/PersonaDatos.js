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
        id_barrio: '',
        barrio: '',
        profesion: '',

        barrio_obj: {id_barrio: '', barrio: ''},
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
                id_barrio: '',
                barrio: '',
                profesion: ''};
    }

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };
    
    //Al seleccionar el barrio del listado desplegado
    handleChangeBarrios = (e, newValue) => {
        this.setState( {id_barrio: newValue.clave, barrio: newValue.valor} );
    };

    //Al tipear el nombre del barrio
    onChangeBarrios = (e,newValue) => {
        this.setState({ barrio: newValue })
    }

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
                                id_barrio: '',
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

    loadData = (id) => {
        conn.searchexactperson(id).then( response => { 
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
                                 id_barrio: data.id_barrio,
                                 barrio: data.barrio,
                                 barrio_obj: {id_barrio: data.id_barrio, barrio: data.barrio},
                                 profesion: data.profesion} );
            }
        });
    } 

    componentDidUpdate(prevProps) {
        if (prevProps.id_pers !== this.props.id_pers) {
            if (this.props.id_pers !== 0) {
                this.setState( { id: this.props.id_pers } );
                this.loadData(this.props.id_pers);
            }
        }
    }

    
    componentDidMount() {
        conn.loadbarrios().then( response => { 
            this.setState( { options_barrios: response.data } );
        });

        //Verifico si es una edición
        if (this.props.id_pers) {
            this.setState( { id: this.props.id_pers } );
            this.loadData(this.props.id_pers);
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
                        <Grid item sm={6} xs={12}>
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
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtNombre" fullWidth name="nombre" label="Nombre" value={this.state.nombre} onChange={e => this.setState({ nombre: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtApellido" fullWidth name="apellido" label="Apellido" value={this.state.apellido} onChange={e => this.setState({ apellido: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtFechaNacimiento" fullWidth name="fecha_nacimiento" label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha_nacimiento} onChange={e => this.setState({ fecha_nacimiento: e.target.value })} ></TextField>
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
                            {/*<TextField select fullWidth
                                label="Seleccione Barrio"
                                id="ddlBarrios"
                                className="labelleft"
                                value={this.state.barrio}
                                onChange={this.handleChangeBarrios}
                                >
                                {
                                    this.state.options_barrios.map(data=><MenuItem key={data.id_barrio} value={data.id_barrio}>{data.barrio}</MenuItem>)
                                }
                            </TextField>   */}
                            <Autocomplete
                                inputValue={this.state.barrio}
                                onChange={this.handleChangeBarrios}
                                onInputChange={ this.onChangeBarrios }
                                options={this.state.options_barrios}
                                getOptionLabel={(option) => option.valor}
                                renderInput={(params) => <TextField {...params} label="Barrio"  />}
                                />
                        </Grid>
                        <Grid item sm={6} xs={12}>
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