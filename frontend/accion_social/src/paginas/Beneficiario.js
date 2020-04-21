import React from "react";
import { Button, TextField, Grid, MenuItem, Switch, Card, CardContent, FormControl, FormGroup, FormLabel } from '@material-ui/core';

class Beneficiario extends React.Component {
    
    state = {
        es_persona_institucion: '',
        nombre: '',
        es_beneficiario: '',
        tipo_beneficio: '',
        tipo_modulo: '',
        entregado: true,
        observaciones: '',
        valor_txt_entregado: 'Si', 
        tipos_de_beneficiarios: []
    };

    handleChangeBeneficiario = (e) => {
        const es_beneficiario = e.target.value;
        let tipos_de_beneficiarios;

        switch (es_beneficiario) {
            case "NO": tipos_de_beneficiarios = [{clave: "NO", valor: "No Corresponde"}];
                break;
            case "MUNI": tipos_de_beneficiarios = [ {clave: "BECA", valor: "Beca Estudiantil"}, {clave: "SUBS", valor: "Subsidio"}, {clave: "OTR", valor: "Otro"}];
                break;
            case "PROV": tipos_de_beneficiarios = [ {clave: "SUBS", valor: "Subsidio"}, {clave: "TARJ", valor: "Tarjeta Río Negro Presente"}, {clave: "SIP", valor: "Siprove"}, {clave: "OTR", valor: "Otro"}];
                break;
            case "NAC": tipos_de_beneficiarios = [ {clave: "AUH", valor: "Asignación Universal por Hijo"}, {clave: "DISC", valor: "Discapacidad"}, {clave: "ALIM", valor: "Alimentar"}, {clave: "PRO", valor: "Progresar"}, {clave: "PEN", valor: "Pensión"}];
                break;
            default: ;
                break;
        }

        this.setState({es_beneficiario: es_beneficiario, tipos_de_beneficiarios: tipos_de_beneficiarios});
    };

    handleChange = (e) => {
        this.setState({persona_institucion: e.target.value});
    };

    handleChangeNombre = (e) => {
        this.setState({nombre: e.target.value});
    };

    handleFormSubmit = () => {
        
    };
    
    render() {
        return (
            <div className="App">
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Beneficiario</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                {/*<form onSubmit={this.handleSubmit}>*/}
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Seleccione si es Persona o Institución"
                                        id="ddlTipoPersonaInstitucion"
                                        className="labelleft"
                                        value={this.state.es_persona_institucion}
                                        onChange={e => { this.setState({es_persona_institucion: e.target.value})}}
                                        >
                                        <MenuItem value={"persona"}>Persona</MenuItem>
                                        <MenuItem value={"institucion"}>Institución</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Seleccione Nombre o Razón Social"
                                        id="ddlPersonaInstitucion"
                                        value={this.state.nombre}
                                        onChange={e => { this.setState({nombre: e.target.value})}}
                                        >
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="¿Ha recibido algún tipo de beneficio?"
                                        id="ddlBeneficiario"
                                        className="labelleft"
                                        value={this.state.es_beneficiario}
                                        onChange={this.handleChangeBeneficiario}
                                        >
                                        <MenuItem value={"NO"}>No</MenuItem>
                                        <MenuItem value={"MUNI"}>Municipal</MenuItem>
                                        <MenuItem value={"PROV"}>Provincial</MenuItem>
                                        <MenuItem value={"NAC"}>Nacional</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Nombre del Beneficio"
                                        id="ddlTipoBeneficiario"
                                        className="labelleft"
                                        value={this.state.tipo_beneficio}
                                        onChange={e => { this.setState({tipo_beneficio: e.target.value})}}
                                        >
                                        {
                                            this.state.tipos_de_beneficiarios.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
                                </Grid> 
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Módulo Otorgado"
                                        id="ddlModulo"
                                        className="labelleft"
                                        value={this.state.modulo}
                                        onChange={e => { this.setState({modulo: e.target.value})}}
                                        >
                                        <MenuItem value={"Limpieza"}>Limpieza</MenuItem>
                                        <MenuItem value={"Comida"}>Comida</MenuItem>
                                        <MenuItem value={"Monetario"}>Monetario</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item container justify="flex-start" xs={6}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">¿Fue Entregado?</FormLabel>
                                        <FormGroup>
                                            <Grid component="label" container alignItems="center" spacing={1}>
                                                <Grid item>No</Grid>
                                                <Grid item>
                                                        <Switch
                                                            checked={this.state.entregado}
                                                            onChange={e => { this.setState({entregado: e.target.checked})}}
                                                            name="entregado" 
                                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                        />
                                                </Grid>
                                                <Grid item>Si</Grid>
                                            </Grid>
                                        </FormGroup> 
                                    </FormControl>        
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="txtObservaciones"
                                        label="Observaciones"
                                        multiline fullWidth
                                        rows={4}
                                        value={this.state.observaciones}
                                    />                            
                                </Grid>  
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                                {/*</form>*/}
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card >    
            </div>
        )
    }
}

export default Beneficiario;