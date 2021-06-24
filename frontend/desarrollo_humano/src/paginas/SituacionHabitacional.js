import React from "react";
import { TextField, MenuItem, Grid, FormControl, FormLabel, FormGroup, Switch } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";

class SituacionHabitacional extends React.Component {
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
        const { situacion_hab } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Situación Habitacional</h2>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿Situación de Calle?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.situacion_calle}
                                                onChange={this.handleChange}
                                                name="situacion_calle" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtViviendaAnterior" fullWidth name="vivienda_anterior" label="Vivienda Anterior" value={situacion_hab.vivienda_anterior} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtConvivienteAnterior" fullWidth name="conviviente_anterior" label="Conviviente Anterior" value={situacion_hab.conviviente_anterior} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtProyeccionSituacion" fullWidth name="proyeccion_situacion" label="Proyección Situación" value={situacion_hab.proyeccion_situacion} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlUbicacionVivienda" fullWidth select name="ubicacion_vivienda" className="labelleft" label="Ubicación Vivienda" value={situacion_hab.ubicacion_vivienda} onChange={this.handleChange} >
                            <MenuItem value="Urbano">Urbano</MenuItem>
                            <MenuItem value="Periférico">Periférico</MenuItem>
                            <MenuItem value="Rural">Rural</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlTipoVivienda" fullWidth select name="tipo_vivienda" className="labelleft" label="Tipo Vivienda" value={situacion_hab.tipo_vivienda} onChange={this.handleChange} >
                            <MenuItem value="Casa">Casa</MenuItem> 
                            <MenuItem value="Rancho">Rancho</MenuItem> 
                            <MenuItem value="Casilla">Casilla</MenuItem>
                            <MenuItem value="Departamento">Departamento</MenuItem>
                            <MenuItem value="Pieza de inquilinato">Pieza de inquilinato</MenuItem>
                            <MenuItem value="Pieza en hostel">Pieza en hostel</MenuItem>
                            <MenuItem value="Pieza en pensión">Pieza en pensión</MenuItem>
                            <MenuItem value="Local no construido para vivienda">Local no construido para vivienda</MenuItem>
                            <MenuItem value="Vivienda móvil">Vivienda móvil</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlPropiedad" fullWidth select name="propiedad" className="labelleft" label="Propiedad" value={situacion_hab.propiedad} onChange={this.handleChange} >
                            <MenuItem value="Propia">Propia</MenuItem>
                            <MenuItem value="Alquilada">Alquilada</MenuItem>
                            <MenuItem value="Prestada">Prestada</MenuItem>
                            <MenuItem value="Usurpada">Usurpada</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtComparteVivienda" fullWidth name="comparte_vivienda" label="Comparte Vivienda" value={situacion_hab.comparte_vivienda} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Luz</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.luz}
                                                onChange={this.handleChange}
                                                name="luz" 
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
                            <FormLabel component="legend">Gas</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.gas}
                                                onChange={this.handleChange}
                                                name="gas" 
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
                            <FormLabel component="legend">Agua Corriente</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.agua_corriente}
                                                onChange={this.handleChange}
                                                name="agua_corriente" 
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
                            <FormLabel component="legend">Cloacas</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.cloacas}
                                                onChange={this.handleChange}
                                                name="cloacas" 
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
                            <FormLabel component="legend">Recolección Residuos</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.recoleccion_residuos}
                                                onChange={this.handleChange}
                                                name="recoleccion_residuos" 
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
                            <FormLabel component="legend">Servicio Colectivo</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.servicio_colectivo}
                                                onChange={this.handleChange}
                                                name="servicio_colectivo" 
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
                            <FormLabel component="legend">Tanque Agua</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.tanque_agua}
                                                onChange={this.handleChange}
                                                name="tanque_agua" 
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
                            <FormLabel component="legend">Agua en Vivienda</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.agua_en_vivienda}
                                                onChange={this.handleChange}
                                                name="agua_en_vivienda" 
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
                            <FormLabel component="legend">Pilar Luz</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.pilar_luz}
                                                onChange={this.handleChange}
                                                name="pilar_luz" 
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
                            <FormLabel component="legend">Conexión Eléctrica</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_hab.conexion_electrica}
                                                onChange={this.handleChange}
                                                name="conexion_electrica" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlBaño" fullWidth select name="banio" className="labelleft" label="Posee Baño" value={situacion_hab.banio} onChange={this.handleChange} >
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="Si - Adentro">Si - Adentro</MenuItem>
                            <MenuItem value="Si - Afuera">Si - Afuera</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="ddlTipoBaño" fullWidth select name="tipo_banio" className="labelleft" label="Tipo Baño" value={situacion_hab.tipo_banio} onChange={this.handleChange} >
                            <MenuItem value="Inodoro">Inodoro</MenuItem>
                            <MenuItem value="Letrina">Letrina</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtCantidadDormitorio" fullWidth name="cantidad_dormitorios" label="Cantidad Dormitorios" value={situacion_hab.cantidad_dormitorios} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtMaterialPiso" fullWidth name="material_piso" label="Material Piso" value={situacion_hab.material_piso} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtMaterialPared" fullWidth name="material_pared" label="Material Pared" value={situacion_hab.material_pared} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtMaterialTecho" fullWidth name="material_techo" label="Material Techo" value={situacion_hab.material_techo} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtTipoCalefaccion" fullWidth name="tipo_calefaccion" label="Tipo Calefacción" value={situacion_hab.tipo_calefaccion} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <TextField id="txtCoccionAlimentos" fullWidth name="coccion_alimentos" label="Cocción Alimentos" value={situacion_hab.coccion_alimentos} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField id="txtMejoraVivienda" fullWidth name="mejora_vivienda" label="Mejora Vivienda" value={situacion_hab.mejora_vivienda} onChange={this.handleChange} ></TextField>
                    </Grid>           
                </Grid>
            </div>
        )
    }
}

export default SituacionHabitacional;