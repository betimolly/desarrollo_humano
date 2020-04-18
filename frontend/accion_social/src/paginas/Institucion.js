import React from "react";
import { Button, TextField, Grid, MenuItem, Card, CardContent } from '@material-ui/core';

class Institucion extends React.Component {
    lista_municipal = [ {clave: "BECA", valor: "Beca Estudiantil"}, {clave: "SUBS", valor: "Subsidio"}, {clave: "OTR", valor: "Otro"}];
    lista_provincial = [ {clave: "SUBS", valor: "Subsidio"}, {clave: "TARJ", valor: "Tarjeta Río Negro Presente"}, {clave: "SIP", valor: "Siprove"}, {clave: "OTR", valor: "Otro"}];
    lista_nacional = [ {clave: "AUH", valor: "AUH"}, {clave: "DISC", valor: "Discapacidad"}, {clave: "ALIM", valor: "Alimentar"}, {clave: "PRO", valor: "Progresar"}, {clave: "PEN", valor: "Pensión"}];

    state = {
        institucion: '',
        cuit: '',
        actividad: '',
        telefono: '',
        email: '',
        calle: '',
        altura: '',
        barrio: '',
        responsable: ''
    };

    handleChangeResponsable = () => {
        
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
                                <h2>Agregar Institución</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                {/*<form onSubmit={this.handleSubmit}>*/}
                                <Grid item xs={6}>
                                    <TextField id="txtInstitucion" fullWidth name="institucion" label="Nombre Institución" value={this.state.institucion} onChange={e => this.setState({ institucion: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtCuit" fullWidth name="cuit" label="CUIL / CUIT" value={this.state.cuit} onChange={e => this.setState({ cuit: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtActividad" fullWidth name="actividad" label="Actividad" value={this.state.actividad} onChange={e => this.setState({ actividad: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={this.state.telefono} onChange={e => this.setState({ telefono: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtEmail" fullWidth name="email" label="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtCalle" fullWidth name="calle" label="Calle" value={this.state.calle} onChange={e => this.setState({ calle: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtAltura" fullWidth name="altura" label="Altura" value={this.state.altura} onChange={e => this.setState({ altura: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="txtBarrio" fullWidth name="barrio" label="Barrio" value={this.state.barrio} onChange={e => this.setState({ barrio: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth
                                        label="Responsable"
                                        id="ddlResponsable"
                                        value={this.state.responsable}
                                        onChange={this.handleChangeResponsable}
                                        >
                                        <MenuItem></MenuItem>
                                    </TextField>
                                </Grid> 
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                                {/*</form>*/}
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Institucion;