import React from "react";
import { TextField, Grid, FormControl, FormLabel, FormGroup, Switch, MenuItem } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";

class SituacionEducacional extends React.Component {
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
        const { situacion_edu } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Situación Educacional</h2>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtCantidadEscolarizado" fullWidth name="cantidad_escolarizado" label="N° Familiares Escolarizados" value={situacion_edu.cantidad_escolarizado} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlUltimoNivelEscolarizado" fullWidth select name="ultimo_nivel_escolarizado" className="labelleft" label="Último Nivel Escolarizado" value={situacion_edu.ultimo_nivel_escolarizado} onChange={this.handleChange} >
                            <MenuItem value="Jardín">Jardín</MenuItem> 
                            <MenuItem value="Primario">Primario</MenuItem> 
                            <MenuItem value="Secundario">Secundario</MenuItem>
                            <MenuItem value="Superior no universitario">Superior no universitario</MenuItem>
                            <MenuItem value="Universitario o más">Universitario o más</MenuItem>
                            <MenuItem value="Educación especial">Educación especial</MenuItem>
                            <MenuItem value="No alfabetizado/sin escolarizar">No alfabetizado/sin escolarizar</MenuItem>
                            <MenuItem value="Ignorado">Ignorado</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <TextField id="txtEstablecimientoEducativo" fullWidth name="establecimiento_educativo" label="Establecimiento Educativo" value={situacion_edu.establecimiento_educativo} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Concurren Centro Municipal?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_edu.concurren_centro_municipal}
                                                onChange={this.handleChange}
                                                name="concurren_centro_municipal" 
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
                            <FormLabel component="legend">¿Reciben Apoyo Pedagógico?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_edu.apoyo_pedagogico}
                                                onChange={this.handleChange}
                                                name="apoyo_pedagogico" 
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
                            <FormLabel component="legend">¿Reciben Apoyo Etap?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_edu.etap}
                                                onChange={this.handleChange}
                                                name="etap" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <TextField id="txtActividadFamiliar" fullWidth name="actividad_familiar" label="Otras Actividades Familiares" value={situacion_edu.actividad_familiar} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <TextField id="txtInstitucionConcurre" fullWidth name="institucion_concurre" label="Instituciones a las que Concurren" value={situacion_edu.institucion_concurre} onChange={this.handleChange} ></TextField>
                    </Grid>                           
                </Grid>
            </div>
        )
    }
}

export default SituacionEducacional;