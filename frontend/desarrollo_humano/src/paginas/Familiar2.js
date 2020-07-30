import React from "react";
import { Card, CardContent, Typography, Grid, TextField, MenuItem } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import PersonaDatos from "../componentes/PersonaDatos2";
import conn from '../ServiceConexion';

class Persona extends React.Component {
    state = {
        id_titular: 0,
        parentesco: '',

        options_pers: []
    };

    handleFormSubmit = (id_familiar) => {
        const familiar = { 
            id_titular: this.state.id_titular,
            parentesco: this.state.parentesco,
            id_familiar: id_familiar
        };

        conn.savefamiliar(familiar).then( response => {
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
                this.setState({ id_titular: 0,
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
                            <Grid item sm={12} xs={12}>
                                <Typography component="h4" variant="h4">
                                    Datos del titular del grupo familiar 
                                </Typography>
                            </Grid>
                            <Grid item sm={6} xs={12}>
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
                            <Grid item sm={6} xs={12} >
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
                    
                        <PersonaDatos titulo="Familiar" afterSavePersona={this.handleFormSubmit} />
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;