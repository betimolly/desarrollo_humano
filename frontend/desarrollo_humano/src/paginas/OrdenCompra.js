import React from "react";
import { Button, TextField, Grid, FormControl, FormLabel, FormGroup, Switch, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class OrdenCompra extends React.Component {
    
    state = {
        id: 0,
        numero: '',
        numero_expediente: '',
        numero_resolucion: '',
        fecha_emision: '',
        plazo_entrega: '',
        proveedor_externo: false,
        destino: '',
        id_proveedor: '',
        razon_social: '',
        observaciones_entrega: '',

        articulo: '',
        id_articulo: '',
        cantidad: '',
        precio_unitario: '',
        proveedor_obj: {id_proveedor: '', razon_social: ''},
        proveedores: [],
        detalleordencompra: [],
        options_articulos: [],

        valor_search: '',  
        dialog_title: '',
        dialog_content: '',
        open: false,
        open_add: false,
    };

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleClickOpenAdd = () => {
        this.setState( { open_add: true} );
    };
    
    handleCloseAdd = () => {
        this.setState( { open_add: false} );
    };

    handleChangeProveedor = (e, newValue) => {
        this.setState( {id_proveedor: newValue.clave} );
    };

    SearchArticulosModulos = (e, newValue) => {
        this.setState({ valor_search: newValue });
        if (newValue.length >= 4) {
            conn.searcharticulosmodulos(newValue).then( response => {
                if (!response.data.error) {
                    this.setState({ options_articulos : response.data });
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangeArticulo = (e, newValue) => {
        if (newValue !== null) {
            this.setState({ articulo: newValue.articulo, id_articulo: newValue.id });
        }
    }

    
    handleAdd = () => {
        const data = this.state.detalleordencompra;                                           
        const newData = {id_articulo: this.state.id_articulo, cantidad: this.state.cantidad, articulo: this.state.articulo, precio_unitario: this.state.precio_unitario };
        data.push(newData);
        this.setState({ detalleordencompra: data, open_add: false, id_articulo: '', cantidad: 0, articulo: '', precio_unitario: 0 });     
    };
    
    
    handleFormSubmit = () => {
        conn.saveordencompra(this.state).then( response => {
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
                                numero: '',
                                numero_expediente: '',
                                numero_resolucion: '',
                                fecha_emision: '',
                                plazo_entrega: '',
                                proveedor_externo: false,
                                destino: '',
                                id_proveedor: '',
                                razon_social: '',
                                observaciones_entrega: ''});
            }
         })
        .catch( error => { console.error(error) } );       
    };


    componentDidMount() {
        conn.loadproveedores().then( response => { 
            this.setState( { proveedores: response.data } );
        });

        if (this.props.match.params.oc) {
            conn.searchordencompra(this.props.match.params.oc).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( { id: data.id,
                                     numero: data.numero,
                                     numero_expediente: data.numero_expediente,
                                     numero_resolucion: data.numero_resolucion,
                                     fecha_emision: data.fecha_emision,
                                     plazo_entrega: data.plazo_entrega,
                                     proveedor_externo: (data.proveedor_externo === 'S') ? true : false,
                                     destino: data.destino,
                                     id_proveedor: data.id_proveedor,
                                     razon_social: data.razon_social,
                                     proveedor_obj: {id_proveedor: data.id_proveedor, razon_social: data.razon_social},
                                     observaciones_entrega: data.observaciones_entrega,
                                     detalleordencompra: data.detalleOC } );

                }
            });
        }
    }

    
    render() {
        return (
            <div className="App">
                <Dialog
                    open={this.state.open_add}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <DialogTitle id="alert-dialog-title">Agregar detalle Orden de Compra</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} >
                            <Grid item sm={2} xs={12}>
                                <TextField id="txtCantidad" fullWidth name="cantidad" label="Cantidad" value={this.state.cantidad} onChange={e => this.setState({ cantidad: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={8} xs={12}>
                                <Autocomplete 
                                    noOptionsText ="Sin datos"
                                    inputValue={this.state.valor_search} 
                                    onChange={this.autocompleteChangeArticulo}
                                    onInputChange={this.SearchArticulosModulos}
                                    getOptionLabel={option => option.articulo}
                                    getOptionSelected={(option, value) => option.articulo === value.articulo}    
                                    options={this.state.options_articulos}
                                    renderInput={params => (
                                        <TextField {...params} id="txtArticulo" name="articulo" label="Buscar Artículo" />)}
                                    /> 
                            </Grid>
                            <Grid item sm={2} xs={12}>
                                <TextField id="txtPrecioUnitario" fullWidth name="precio_unitario" label="Precio U." value={this.state.precio_unitario} onChange={e => this.setState({ precio_unitario: e.target.value })} ></TextField>
                            </Grid> 
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAdd} color="primary" autoFocus>
                            Agregar
                        </Button>
                    </DialogActions>
                </Dialog>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={1} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Orden de Compra</h2>
                            </Grid>
                            <Grid item sm={3} xs={12}>
                                <TextField id="txtNumero" fullWidth name="numero" label="Número" value={this.state.numero} onChange={e => this.setState({ numero: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={3} xs={12}>
                                <TextField id="txtNumeroExpediente" fullWidth name="numero_expediente" label="Expediente" value={this.state.numero_expediente} onChange={e => this.setState({ numero_expediente: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={3} xs={12}>
                                <TextField id="txtNumeroResolucion" fullWidth name="numero_resolucion" label="Resolución" value={this.state.numero_resolucion} onChange={e => this.setState({ numero_resolucion: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={3} xs={12}>
                                <TextField id="txtPlazoEntrega" fullWidth name="plazo_entrega" label="Plazo Entrega" value={this.state.plazo_entrega} onChange={e => this.setState({ plazo_entrega: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={3} xs={12}>
                                <TextField id="txtFechaEmision" fullWidth name="fecha_emision" label="Fecha Emisión" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha_emision} onChange={e => this.setState({ fecha_emision: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item container justify="flex-start" sm={3} xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">¿Proveedor Externo?</FormLabel>
                                    <FormGroup>
                                        <Grid component="label" container alignItems="center" spacing={1}>
                                            <Grid item>No</Grid>
                                            <Grid item>
                                                    <Switch
                                                        checked={this.state.proveedor_externo}
                                                        onChange={e => { this.setState({proveedor_externo: e.target.checked})}}
                                                        name="proveedor_externo" 
                                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                    />
                                            </Grid>
                                            <Grid item>Si</Grid>
                                        </Grid>
                                    </FormGroup> 
                                </FormControl>        
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                {/*<TextField select fullWidth
                                    label="Proveedor"
                                    id="ddlProveedor"
                                    className="labelleft"
                                    name="id_proveedor"
                                    value={this.state.id_proveedor}
                                    onChange={this.handleChangeProveedor}
                                    >
                                    {
                                        this.state.proveedores.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                    }    
                                </TextField>*/}
                                <Autocomplete
                                    id="ddlProveedor"
                                    inputValue={this.state.razon_social}
                                    onInputChange={ (e,newValue)=>{this.setState({ razon_social: newValue })} }
                                    onChange={this.handleChangeProveedor}
                                    options={this.state.proveedores}
                                    getOptionLabel={(option) => option.valor}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Proveedor" />}
                                    />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    id="txtDestino"
                                    label="Destino"
                                    multiline fullWidth
                                    rows={2}
                                    value={this.state.destino}
                                    onChange={e => { this.setState({destino: e.target.value})}}
                                />                            
                            </Grid> 
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    id="txtObservaciones"
                                    label="Observaciones Entrega"
                                    multiline fullWidth
                                    rows={2}
                                    value={this.state.observaciones_entrega}
                                    onChange={e => { this.setState({observaciones_entrega: e.target.value})}}
                                />                            
                            </Grid> 
                            <Grid item xs={12}>
                                <MaterialTable
                                    title="Detalle de Artículos"
                                    className="table table-striped"
                                    localization={{
                                        pagination: {
                                            labelDisplayedRows: '{from}-{to} de {count}',
                                            labelRowsSelect: 'Filas'
                                        },
                                        header: {
                                            actions: 'Acciones'
                                        },
                                        body: {
                                            emptyDataSourceMessage: 'No hay detalle en la orden de compra.',
                                            addTooltip: 'Agregar nuevo detalle',
                                            editTooltip: 'Editar detalle',
                                            deleteTooltip: 'Eliminar detalle',
                                            editRow: {
                                                deleteText: '¿Está seguro de eliminar este detalle?',
                                                cancelTooltip: 'Cancelar',
                                                saveTooltip: 'Guardar',
                                            }
                                        }
                                    }}      
                                    options={{
                                        search: false
                                    }}
                                    columns={ [
                                        { title: 'Id_articulo', field: 'id_articulo', hidden: true, cellStyle: { width: '10%' } },
                                        { title: 'Cantidad', field: 'cantidad', cellStyle: { width: '10%' } },
                                        { title: 'Artículo', field: 'articulo', editable: 'never', cellStyle: { width: '70%' } },
                                        { title: 'Precio Unitario', field: 'precio_unitario', cellStyle: { width: '10%' } }
                                    ] }
                                    data={ this.state.detalleordencompra }     
                                    actions={[
                                        {
                                          icon: 'add',
                                          tooltip: 'Agregar detalle',
                                          isFreeAction: true,
                                          onClick: (event) => this.setState( {open_add: true} )
                                        }
                                      ]}  
                                    editable={{
                                        /*onRowAdd: newData =>
                                          new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                              {
                                                const data = this.state.detalleordencompra;
                                                data.push(newData);
                                                this.setState({ detalleordencompra: data }, () => resolve());
                                              }
                                              resolve()
                                            }, 1000)
                                          }),*/
                                        onRowUpdate: (newData, oldData) =>
                                          new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                              {
                                                const data = this.state.detalleordencompra;
                                                const index = data.indexOf(oldData);
                                                data[index] = newData;
                                                this.setState({ detalleordencompra: data }, () => resolve());
                                              }
                                              resolve()
                                            }, 1000)
                                          }),
                                        onRowDelete: oldData =>
                                          new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                              {
                                                let data = this.state.detalleordencompra;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.setState({ detalleordencompra: data }, () => resolve());
                                              }
                                              resolve()
                                            }, 1000)
                                          }),
                                      }}
                                />                              
                            </Grid>

                            <Grid item container justify="flex-start" xs={12}>
                                <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                            </Grid>
                                              
                        </Grid> 
                    </CardContent>   
                </Card> 
            </div >
          
        )
    }
}

export default OrdenCompra;