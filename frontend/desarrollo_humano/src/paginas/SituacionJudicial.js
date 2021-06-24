import React from "react";
import { TextField, Grid, FormControl, FormLabel, FormGroup, Switch } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";

class SituacionJudicial extends React.Component {
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
        const { situacion_judicial } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Situación Judicial</h2>
                    </Grid>
                    <Grid item container justify="flex-start" sm={3} xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">¿En Proceso Judicial?</FormLabel>
                            <FormGroup>
                                <Grid component="label" container alignItems="center" spacing={1}>
                                    <Grid item>No</Grid>
                                    <Grid item>
                                            <Switch
                                                checked={situacion_judicial.proceso_judicial}
                                                onChange={this.handleChange}
                                                name="proceso_judicial" 
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                    </Grid>
                                    <Grid item>Si</Grid>
                                </Grid>
                            </FormGroup> 
                        </FormControl>        
                    </Grid>
                    <Grid item sm={9} xs={12}>
                        <TextField id="txtAmbitoProcesoJudicial" fullWidth name="ambito_proceso_judicial" label="Órbita del Proceso Judicial" value={situacion_judicial.ambito_proceso_judicial} onChange={this.handleChange} ></TextField>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <TextField id="txtProfesionalInterviniente" fullWidth name="profesional_interviniente" label="Profesional Interviniente" value={situacion_judicial.profesional_interviniente} onChange={this.handleChange} ></TextField>
                    </Grid>  
                    <Grid item sm={12} xs={12}>
                        <TextField id="txtInstitucionConcurre" fullWidth name="institucion_concurre" label="Instituciones que Concurre" value={situacion_judicial.institucion_concurre} onChange={this.handleChange} ></TextField>
                    </Grid>                           
                </Grid>
            </div>
        )
    }
}

export default SituacionJudicial;