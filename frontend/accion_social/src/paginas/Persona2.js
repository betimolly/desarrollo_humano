import React from "react";
import { Button, TextField, Grid } from '@material-ui/core';

class Persona extends React.Component {
    
    state = {
        nombre: '',
        apellido: '',
        ndoc: '',
        fecha_nacimiento: '',
        edad: '',
        telefono: '',
        email: '',
        calle: '',
        altura: '',
        barrio: ''
    };

    handleFormSubmit = () => {
        
    };
    
    render() {
        return (
            <div className="App">
                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Agregar Persona</h2>
                    </Grid>
                    <Grid container spacing={3} item xs={12}>
                        {/*<form onSubmit={this.handleSubmit}>*/}
                        <Grid item xs={6}>
                            <TextField id="txtNombre" fullWidth name="nombre" label="Nombre" value={this.state.nombre} onChange={e => this.setState({ nombre: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="txtApellido" fullWidth name="apellido" label="Apellido" value={this.state.apellido} onChange={e => this.setState({ apellido: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="txtNdoc" fullWidth name="ndoc" label="Nro. Documento" value={this.state.bdoc} onChange={e => this.setState({ ndoc: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="txtFechaNacimiento" fullWidth name="fecha_nacimiento" label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha_nacimiento} onChange={e => this.setState({ fecha_nacimiento: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="txtEdad" fullWidth name="edad" label="Edad" value={this.state.edad} onChange={e => this.setState({ edad: e.target.value })} ></TextField>
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
                        <Grid item container justify="flex-start" xs={12}>
                            <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                        </Grid>
                        {/*</form>*/}
                    </Grid>                    
                </Grid>
            </div>
        )
    }
}

export default Persona;