import React from "react";
import { TextField, MenuItem, Grid } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import conn from '../ServiceConexion';


class PersonaDatos extends React.Component {

    state = {
        options_pers: [],
        options_barrios: [],
        paises: [],

        dialog_title: '',
        dialog_content: '',
        open: false
    };

    getNewPerson = (nrodoc='') => {
        return {id: 0, 
                id_titular: '',
                nombre: '',
                apellido: '',
                ndoc: nrodoc,
                sexo: '',
                cuil: '',
                fecha_nacimiento: '',
                edad: '',
                calle: '',
                altura: '',
                id_barrio: '',
                barrio: '',
                parentesco: '',
                telefono: '',
                email: '',
                nacionalidad: '',
                tiempo_residencia: '',
                escolaridad: '',
                situacion_salud: '',
                titular: (this.props.persona.titular) ? this.props.persona.titular : false
            };
    }

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };
    
    //Al seleccionar el barrio del listado desplegado
    handleChangeBarrios = (e, newValue, reason) => {
        const personaProp = {
            barrio: newValue.valor,
            id_barrio: newValue.clave
        };
        this.props.onChange(personaProp);
    };

    //Al tipear el nombre del barrio
    onChangeBarrios = (e,newValue, reason) => {
        if(e && e.type && e.type === 'change'){
            const personaProp = {
                barrio: newValue
            };
            this.props.onChange(personaProp);             
        }     
    }


    searchPersona = (e, nrodoc, reason) => {
        if(e && e.type && e.type === 'change'){
            this.props.onChange({ndoc: nrodoc});
            
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
    } 

    autocompleteChangePersona = (e, newValue) => {
        this.props.onChange({...newValue});

        if ((newValue !== null) && this.props.onChangePersona) {
            this.props.onChangePersona(newValue.id);
        }
    }

    showEdad = e => {
        const fecha_nacimiento = e.target.value;
        const edad = this.calcEdad(fecha_nacimiento);
        this.props.onChange({ edad, fecha_nacimiento });
    }

    calcEdad = fecha => { 
        const hoy = new Date();
        const fecha_nac = new Date( fecha );
        let edad = hoy.getFullYear() - fecha_nac.getFullYear();
        const m = hoy.getMonth() - fecha_nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fecha_nac.getDate())) {
            edad--;
        }
        return (edad >= 0 ? edad : '');
    }
    
    componentDidMount() {
        conn.loadbarrios().then( response => { 
            this.setState( { options_barrios: response.data } );
        });
        conn.loadpaises().then( response => { 
            this.setState( { paises: response.data } );
        });
    }

    handleChange = e => {
        const key = e.target.name;
        const value = e.target.value;
        const personaProp = {
            [key]: value
        };
        this.props.onChange(personaProp);
    };

    render() {
        const { persona, es_familiar, es_edicion } = this.props;
        let edad = this.calcEdad(persona.fecha_nacimiento);
        const size = es_familiar ? 4 : 6;

        return (
            <React.Fragment >
                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>{this.props.titulo}</h2>
                    </Grid>
                    <Grid container spacing={3} item xs={12}>
                        <Grid item sm={4} xs={12}>
                            {
                                es_edicion ? 
                                (<TextField id="txtNdocEdit" fullWidth name="ndoc" label="Nro. Documento" value={persona.ndoc} inputProps={{readOnly: es_edicion}} ></TextField>) 
                                :
                                (<React.Fragment>
                                    <Autocomplete
                                        inputValue={persona.ndoc.toString()}
                                        onInputChange={this.searchPersona}
                                        loadingText='Cargando...'
                                        noOptionsText ="Sin datos"
                                        onChange={this.autocompleteChangePersona}
                                        getOptionLabel={option => option.ndoc ? option.ndoc.toString() : '' }
                                        renderInput={params => (
                                            <TextField {...params} id="txtNdoc" name="ndoc" label="Nro. Documento" fullWidth inputProps={{ ...params.inputProps, maxLength: 8}} />)}
                                        options={this.state.options_pers} />
                                        <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                                </React.Fragment>)
                            }
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextField id="ddlSexo" fullWidth select name="sexo" className="labelleft" label="Sexo" value={persona.sexo} onChange={this.handleChange} >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="F">Femenino</MenuItem>
                                <MenuItem value="M">Masculino</MenuItem>
                                <MenuItem value="S">Sociedad</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextField id="txtCuil" fullWidth name="cuil" label="CUIL" value={persona.cuil} onChange={this.handleChange} inputProps={{maxLength:12}} ></TextField>
                        </Grid>
                        <Grid item sm={size} xs={12}>
                            <TextField id="txtNombre" fullWidth name="nombre" label="Nombre" value={persona.nombre} onChange={this.handleChange} inputProps={{maxLength:35}} ></TextField>
                        </Grid>
                        <Grid item sm={size} xs={12}>
                            <TextField id="txtApellido" fullWidth name="apellido" label="Apellido" value={persona.apellido} onChange={this.handleChange} inputProps={{maxLength:50}} ></TextField>
                        </Grid>
                        {
                            es_familiar && (
                                <Grid item sm={size} xs={12}>
                                    <TextField id="ddlParentesco" select fullWidth name="parentesco" label="Parentesco" className="labelleft" value={persona.parentesco} onChange={this.handleChange} >
                                        <MenuItem value="Cónyuge/Pareja">Cónyuge/Pareja</MenuItem>
                                        <MenuItem value="Hijo/a">Hijo/a</MenuItem>
                                        <MenuItem value="Yerno/Nuera">Yerno/Nuera</MenuItem>
                                        <MenuItem value="Nieto">Nieto</MenuItem>
                                        <MenuItem value="Padre/madre">Padre/Madre</MenuItem>
                                        <MenuItem value="Suegro/a">Suegro/a</MenuItem>
                                        <MenuItem value="Abuelo/a">Abuelo/a</MenuItem>
                                        <MenuItem value="Tío/a">Tío/a</MenuItem>
                                        <MenuItem value="Primo/a">Primo/a</MenuItem>
                                        <MenuItem value="Otros familiares">Otros familiares</MenuItem>
                                        <MenuItem value="Otros No familiares">Otros no familiares</MenuItem>
                                    </TextField>
                                </Grid>
                            )
                        }
                        <Grid item sm={4} xs={12}>
                            <TextField id="txtFechaNacimiento" fullWidth name="fecha_nacimiento" label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true }} value={persona.fecha_nacimiento} onChange={this.handleChange} ></TextField>
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            <TextField id="txtEdad" fullWidth inputProps={{readOnly: true}} name="edad" label="Edad" value={edad} InputLabelProps={{ shrink: true }} ></TextField>
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={persona.telefono} onChange={this.handleChange} inputProps={{maxLength:12}} ></TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextField id="txtEmail" fullWidth name="email" label="Email" value={persona.email} onChange={this.handleChange} inputProps={{maxLength:50}} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtCalle" fullWidth name="calle" label="Calle" value={persona.calle} onChange={this.handleChange} inputProps={{maxLength:50}} ></TextField>
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            <TextField id="txtAltura" fullWidth name="altura" label="Altura" value={persona.altura} onChange={this.handleChange} inputProps={{maxLength:5}} ></TextField>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <Autocomplete
                                inputValue={persona.barrio}
                                onChange={this.handleChangeBarrios}
                                onInputChange={ this.onChangeBarrios }
                                options={this.state.options_barrios}
                                getOptionLabel={(option) => option.valor}
                                renderInput={(params) => <TextField {...params} label="Barrio"  />}
                                />
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <TextField id="ddlNacionalidad" select fullWidth name="nacionalidad" label="Nacionalidad/País" className="labelleft" value={persona.nacionalidad} onChange={this.handleChange} >
                                {   
                                    this.state.paises.map((data) => 
                                    <MenuItem key={data.id} value={data.nombre}>{data.nombre}</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <TextField id="txtTiempoResidencia" fullWidth name="tiempo_residencia" label="Tiempo Residencia" value={persona.tiempo_residencia} onChange={this.handleChange} inputProps={{maxLength:30}} ></TextField>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <TextField id="txtEscolaridad" fullWidth name="escolaridad" label="Escolaridad" value={persona.escolaridad} onChange={this.handleChange} inputProps={{maxLength:30}} ></TextField>
                        </Grid>
                        <Grid item sm={3} xs={12}>
                            <TextField id="txtSituacionSalud" fullWidth name="situacion_salud" label="Situación Salud" value={persona.situacion_salud} onChange={this.handleChange} inputProps={{maxLength:30}}  ></TextField>
                        </Grid>
                    </Grid>                    
                </Grid>
            </React.Fragment>
        )
    }
}

export default PersonaDatos;