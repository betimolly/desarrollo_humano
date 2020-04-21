import React from "react";
import { Card, CardContent, Typography, Grid, TextField, MenuItem } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import PersonaDatos from "../componentes/PersonaDatos";
import conn from '../ServiceConexion';

class Persona extends React.Component {
    state = {
        id_titular: 0,

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
        parentesco: '',

        options_pers: []
    };

    handleFormSubmit = () => {
        conn.savefamiliar(this.state).then( response => {
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
                                parentesco: ''});
            }
         })
        .catch( error => { console.error(error) } );
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
        this.setState({ id_titular: newValue.id })
    }    

    render() {
        const { options_pers } = this.state;
      
        return (
            <div className="App" >
                <Card className="Card" >    
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item xs={12}>
                                <Typography component="h4" variant="h4">
                                    Datos del titular del grupo familiar 
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    autoComplete={true}
                                    freeSolo
                                    loadingText='Cargando...'
                                    noOptionsText ="Sin datos"
                                    onChange={this.autocompleteChangePersona}
                                    getOptionLabel={option => option.ndoc ? option.ndoc.toString() + ' - ' + option.nombre + ' ' + option.apellido  : '' }
                                    renderInput={params => (
                                        <TextField {...params} id="txtNdoc" name="ndoc" label="Titular Nro. Documento" fullWidth value={this.state.ndoc}  onChange={this.searchPersona}  />)}
                                    options={options_pers} />
                                    <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="ddlParentesco" select fullWidth name="parentesco" label="Parentesco" className="labelleft" value={this.state.parentesco} onChange={e => this.setState({ parentesco: e.target.value })} >
                                    <MenuItem value="Hijos">Hijo</MenuItem>
                                    <MenuItem value="Padres">Padres</MenuItem>
                                    <MenuItem value="Esposos">Esposos</MenuItem>
                                    <MenuItem value="Hermanos">Hermanos</MenuItem>
                                    <MenuItem value="Abuelos">Abuelos</MenuItem>
                                    <MenuItem value="Tíos">Tíos</MenuItem>
                                    <MenuItem value="Primos">Primos</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    
                        <PersonaDatos titulo="Familiar" />
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;