import React from "react";
import { TextField, Grid, FormControl, FormLabel, FormGroup, Switch, Chip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class SituacionEconomica extends React.Component {
    state = {
        options_percibe: [],
        dialog_title: '',
        dialog_content: '',
        open: false
    };
    

    handleClose = () => {
        this.setState( { open: false} );
    };


    handleChange = e => {
        const key = e.target.name;
        const value = (e.target.type === "checkbox") ? e.target.checked : e.target.value;
        const situacionProp = {
            [key]: value
        };

        this.props.onChange(situacionProp);
    };
    
    componentDidMount() {
        conn.loadbeneficios().then( response => { 
            this.setState( { options_percibe: response.data } );
        });
    }

    
    autocompleteChangeBeneficio = (e, newValue, reason) => {
        //if (reason === "remove-option") {
        //    alert(newValue);
        //}
        //else {
        //    const data = this.state.lista_percibe;          
        //    data.push(newValue);
        //    this.setState({ lista_percibe: data });
        //}
        const situacionProp = {
            lista_percibe: newValue
        };
        this.props.onChange(situacionProp);
        //this.setState({ lista_percibe: newValue });
    }  


    render() {
        const { situacion_economica } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Situación Económica</h2>
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Trabaja el Titular?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.titular_trabaja}
                                                onChange={this.handleChange}
                                                name="titular_trabaja" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Es Trabajo Formal?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.formal}
                                                onChange={this.handleChange}
                                                name="formal" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Es Ingreso Fijo?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.ingreso_fijo}
                                                onChange={this.handleChange}
                                                name="ingreso_fijo" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtActividad" fullWidth name="actividad" label="Trabajo que realiza" value={situacion_economica.actividad} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Familiar Trabaja?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.familiar_trabaja}
                                                onChange={this.handleChange}
                                                name="familiar_trabaja" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Es Trabajo Formal?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.formal_familiar}
                                                onChange={this.handleChange}
                                                name="formal_familiar" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={2} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Es Ingreso Fijo?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.ingreso_fijo_familiar}
                                                onChange={this.handleChange}
                                                name="ingreso_fijo_familiar" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtActividadFliar" fullWidth name="actividad_familiar" label="Trabajo que realiza el Familiar" value={situacion_economica.actividad_familiar} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" align="left">¿Percibe Alimentos por parte del Estado?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.percibe_alimentos_estado}
                                                onChange={this.handleChange}
                                                name="percibe_alimentos_estado" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" align="left">¿Retira Alimentos de Comedor / Merendero?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.retira_alimentos}
                                                onChange={this.handleChange}
                                                name="retira_alimentos" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" align="left">¿Percibe Alimentos de Instituciones?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.percibe_alimentos_soc}
                                                onChange={this.handleChange}
                                                name="percibe_alimentos_soc" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" align="left">¿Los niños se alimentan en Instituciones Educativas?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_economica.alimentacion_menores}
                                                onChange={this.handleChange}
                                                name="alimentacion_menores" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <Autocomplete
                            multiple
                            id="size-small-standard-multi"
                            size="small"
                            noOptionsText ="Sin datos"
                            options={this.state.options_percibe}
                            onChange={this.autocompleteChangeBeneficio}
                            getOptionLabel={(option) => option.valor}
                            defaultValue={situacion_economica.lista_percibe}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => ( 
                                  <Chip
                                    variant="outlined"
                                    label={option.valor}
                                    size="small"
                                    color="secondary"
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                            renderInput={(params) => (
                                <TextField {...params} variant="standard" label="Beneficios o Ayudas" placeholder="Beneficios o Ayudas" />
                            )}
                        />
                    </Grid>                    
                </Grid>
            </div>
        )
    }
}

export default SituacionEconomica;