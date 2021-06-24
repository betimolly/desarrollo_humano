import React from "react";
import { Button, TextField, Grid, MenuItem, Card, CardContent } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class Proveedor extends React.Component {
    
    state = {
        id: 0,
        cuit: '',
        razon_social: '',
        contacto: '',
        domicilio: '',
        telefono: '',
        email: '',
        id_localidad: '',
        observaciones_entrega: '',
        baja: '',
        fecha_baja: '',
        lista_localidades: [],
        
        dialog_title: '',
        dialog_content: '',
        open: false
    };

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleChangeLocalidades = (e) => {
        this.setState( {id_localidad: e.target.value} );
    };

    handleFormSubmit = () => {
        conn.saveproveedor(this.state).then( response => {
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
                this.setState({ id: 0,
                                cuit: '',
                                razon_social: '',
                                contacto: '',
                                domicilio: '',
                                telefono: '',
                                email: '',
                                id_localidad: '',
                                observaciones_entrega: '',
                                baja: '',
                                fecha_baja: '',
                                lista_localidades: []});
            }
         })
        .catch( error => { console.error(error) } );       
    };

    componentDidMount() {
        conn.loadlocalidades().then( response => { 
            this.setState( { lista_localidades: response.data } );
        });

        //Verifico si es una edición
        if (this.props.match.params.prov) {
            conn.searchproveedor(this.props.match.params.prov).then( response => { 
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( { id: data.id,
                                     cuit: data.cuit,
                                     razon_social: data.razon_social,
                                     contacto: data.contacto,
                                     domicilio: data.domicilio,
                                     telefono: data.telefono,
                                     email: data.email,
                                     id_localidad: data.id_localidad,
                                     observaciones_entrega: data.observaciones_entrega,
                                     baja: data.baja,
                                     fecha_baja: data.fecha_baja} );
                }
            });
        }
    };
    
    render() {
        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Proveedor</h2>
                            </Grid>
                            <Grid container spacing={3} item xs={12}>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtRazonSocial" fullWidth name="razon_social" label="Razón Social" value={this.state.razon_social} onChange={e => this.setState({ razon_social: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtCuit" fullWidth name="cuit" label="Cuit" value={this.state.cuit} onChange={e => this.setState({ cuit: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtContacto" fullWidth name="contacto" label="Contacto" value={this.state.contacto} onChange={e => this.setState({ contacto: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtDomicilio" fullWidth name="domicilio" label="Domicilio" value={this.state.domicilio} onChange={e => this.setState({ domicilio: e.target.value })} ></TextField>                            
                                </Grid> 
                                <Grid item sm={4} xs={12}>
                                    <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={this.state.telefono} onChange={e => this.setState({ telefono: e.target.value })} ></TextField> 
                                </Grid>
                                <Grid item sm={4} xs={12}>
                                    <TextField id="txtEmail" fullWidth name="email" label="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} ></TextField>                          
                                </Grid> 
                                <Grid item sm={4} xs={12}>
                                    <TextField select fullWidth
                                        label="Seleccione Localidad"
                                        id="ddlLocalidad"
                                        className="labelleft"
                                        name="id_localidad"
                                        value={this.state.id_localidad}
                                        onChange={this.handleChangeLocalidades}
                                        >
                                        {
                                            this.state.lista_localidades.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                        }
                                    </TextField>                            
                                </Grid> 
                                <Grid item xs={12}>
                                    <TextField
                                        id="txtObservaciones"
                                        label="Observaciones Entrega"
                                        multiline fullWidth
                                        rows={4}
                                        value={this.state.observaciones_entrega}
                                        onChange={e => { this.setState({observaciones_entrega: e.target.value})}}
                                    />                            
                                </Grid>  
                                <Grid item container justify="flex-start" xs={12}>
                                    <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                                </Grid>
                            </Grid>                    
                        </Grid>
                    </CardContent>
                </Card >    
            </div>
        )
    }
}

export default Proveedor;