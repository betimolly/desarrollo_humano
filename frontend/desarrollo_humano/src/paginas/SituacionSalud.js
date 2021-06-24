import React from "react";
import { TextField, Grid, FormControl, FormLabel, FormGroup, Switch } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";

class SituacionSalud extends React.Component {
    state = {
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


    render() {
        const { situacion_salud } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Situación Salud</h2>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtEnfermedad" fullWidth name="enfermedad" label="Enfermedades que posee" value={situacion_salud.enfermedad} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtLugarTratamiento" fullWidth name="lugar_tratamiento" label="Lugar Tratamiento" value={situacion_salud.lugar_tratamiento} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtEnfermedadFamiliar" fullWidth name="enfermedad_familiar" label="Enfermedad Familiares" value={situacion_salud.enfermedad_familiar} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtLugarTratamientoF" fullWidth name="lugar_tratamiento_familiar" label="Lugar Tratamiento del Familiar" value={situacion_salud.lugar_tratamiento_familiar} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Familiar con Discapacidad?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_salud.familiar_discapacitado}
                                                onChange={this.handleChange}
                                                name="familiar_discapacitado" 
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
                            <FormLabel component="legend">Certificado de Discapacidad</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_salud.posee_certificado}
                                                onChange={this.handleChange}
                                                name="posee_certificado" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtObraSocial" fullWidth name="obra_social" label="Obra Social" value={situacion_salud.obra_social} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtMedicacion" fullWidth name="medicacion" label="Medicación que toma" value={situacion_salud.medicacion} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtMedico" fullWidth name="medico" label="Médico/s que lo tratan" value={situacion_salud.medico} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Posee Pase de Transporte?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_salud.posee_pase_transporte}
                                                onChange={this.handleChange}
                                                name="posee_pase_transporte" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={9} xs={12}>
                        <TextField id="txtReferentes" fullWidth name="referente" label="Referente/Acompañante/Apoyo" value={situacion_salud.referente} onChange={this.handleChange} ></TextField>
                    </Grid>                           
                </Grid>
            </div>
        )
    }
}

export default SituacionSalud;