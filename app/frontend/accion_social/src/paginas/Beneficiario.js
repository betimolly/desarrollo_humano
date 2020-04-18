import React from "react";
import { Button, TextField, Grid, MenuItem, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Card, CardContent  } from '@material-ui/core';

class Beneficiario extends React.Component {
    
    state = {
        persona_institucion: '',
        nombre: '',
        es_beneficiario: '',
        tipo_beneficiario: '',
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

    handleChangeTipoBeneficiario = (e) => {
        this.setState({tipo_beneficiario: e.target.value})
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
                                <Grid item container justify="flex-start" xs={6}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Es Persona o Institución</FormLabel>
                                        <RadioGroup row aria-label="position" name="persona_institucion" value={this.state.persona_institucion} onChange={this.handleChange} defaultValue="top">
                                            <FormControlLabel
                                                value="persona"
                                                control={<Radio color="primary" />}
                                                label="Persona"
                                                labelPlacement="start"
                                            />
                                            <FormControlLabel
                                                value="institucion"
                                                control={<Radio color="primary" />}
                                                label="Institución"
                                                labelPlacement="start"
                                            />
                                        </RadioGroup>
                                    </FormControl>    
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Seleccione"
                                        id="ddlPersonaInstitucion"
                                        value={this.state.nombre}
                                        onChange={this.handleChangeNombre}
                                        >
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="¿Es Beneficiario?"
                                        id="ddlBeneficiario"
                                        value={this.state.es_beneficiario}
                                        onChange={this.handleChangeBeneficiario}
                                        >
                                        <MenuItem value={"NO"}>No corresponde</MenuItem>
                                        <MenuItem value={"MUNI"}>Municipal</MenuItem>
                                        <MenuItem value={"PROV"}>Provincial</MenuItem>
                                        <MenuItem value={"NAC"}>Nacional</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Tipo Beneficio"
                                        id="ddlTipoBeneficiario"
                                        value={this.state.tipo_beneficiario}
                                        onChange={this.handleChangeTipoBeneficiario}
                                        >
                                        {
                                            this.state.tipos_de_beneficiarios.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
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