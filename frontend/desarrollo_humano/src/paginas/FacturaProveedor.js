import React from "react";
import { Button, TextField, Grid,  Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class FacturaProveedor extends React.Component {
    
    state = {
        id: 0,
        numero: '',
        fecha: '',
        id_proveedor: '',
        id_orden_compra: '',
        razon_social: '',
        observaciones: '',
        orden_compra: '',

        id_detalle_orden: '',
        id_articulo: '',
        articulo: '',
        cantidad: '',
        precio_unitario: '',

        proveedor_obj: {id_proveedor: '', razon_social: ''},
        proveedores: [],
        ordenes_compras: [],
        detalleitemsfactura: [],
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

    handleChangeOC = (e, newValue) => {
        if (newValue !== null) {
            this.setState( {id_orden_compra: newValue.id} );
            
            conn.loaddetalleOC(newValue.id).then( response => { 
                if (!response.data.error) {
                    this.setState( { detalleitemsfactura: response.data } );
                }
            });

        }
    };

    SearchArticulosOC = (e, newValue) => {
        this.setState({ valor_search: newValue });
        conn.searcharticulosOC(newValue, this.state.id_orden_compra, this.state.orden_compra).then( response => {
            if (!response.data.error) {
                this.setState({ options_articulos : response.data });
            }
            })
        .catch( error => { console.error(error) } );
    } 

    autocompleteChangeArticulo = (e, newValue) => {
        if (newValue !== null) {
            this.setState({ articulo: newValue.articulo, id_articulo: newValue.id, id_orden_compra_detalle:newValue.id_orden_compra_detalle });
        }
    }

    
    handleAdd = () => {
        const data = this.state.detalleitemsfactura;                                           
        const newData = {id_articulo: this.state.id_articulo, cantidad: this.state.cantidad, articulo: this.state.articulo, 
                         precio_unitario: this.state.precio_unitario, id_orden_compra_detalle: this.state.id_orden_compra_detalle };
        data.push(newData);
        this.setState({ detalleitemsfactura: data, open_add: false, id_articulo: '', cantidad: 0, articulo: '', precio_unitario: 0, id_orden_compra_detalle: '' });     
    };
    
    
    handleFormSubmit = () => {
        conn.savefactura(this.state).then( response => {
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
                                fecha: '',
                                id_proveedor: '',
                                id_orden_compra: '',
                                razon_social: '',
                                observaciones: '',
                                orden_compra: '',
                                detalleitemsfactura: [] });
            }
         })
        .catch( error => { console.error(error) } );       
    };


    componentDidMount() {
        conn.loadproveedores().then( response => { 
            this.setState( { proveedores: response.data } );
        });
        conn.loadordenescompras().then( response => { 
            this.setState( { ordenes_compras: response.data } );
        });

        if (this.props.match.params.fac) {
            conn.searchfactura(this.props.match.params.fac).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( { id: data.id,
                                     numero: data.numero,
                                     fecha: data.fecha,
                                     id_proveedor: data.id_proveedor,
                                     id_orden_compra: data.id_orden_compra,
                                     razon_social: data.razon_social,
                                     orden_compra: data.orden_compra,
                                     observaciones: data.observaciones,
                                     proveedor_obj: {id_proveedor: data.id_proveedor, razon_social: data.razon_social},
                                     detalleitemsfactura: data.detalleitemsfactura
                                    } );
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
                    <DialogTitle id="alert-dialog-title">Agregar detalle de Factura</DialogTitle>
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
                                    onInputChange={this.SearchArticulosOC}
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
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Agregar Factura del Proveedor</h2>
                            </Grid>
                            <Grid item sm={2} xs={12}>
                                <TextField id="txtNumero" fullWidth name="numero" label="Número" value={this.state.numero} onChange={e => this.setState({ numero: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={2} xs={12}>
                                <Autocomplete
                                    inputValue={this.state.orden_compra}
                                    onInputChange={ (e,newValue)=>{this.setState({ orden_compra: newValue })} }
                                    onChange={this.handleChangeOC}
                                    options={this.state.ordenes_compras}
                                    getOptionLabel={(option) => option.numero}
                                    renderInput={(params) => <TextField {...params} fullWidth label="Orden Compra" />}
                                    />
                            </Grid>
                            <Grid item sm={2} xs={12}>
                                <TextField id="txtFecha" fullWidth name="fecha" label="Fecha" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha} onChange={e => this.setState({ fecha: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
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
                            <Grid item xs={12}>
                                <TextField
                                    id="txtObservaciones"
                                    label="Observaciones Entrega"
                                    multiline fullWidth
                                    rows={2}
                                    value={this.state.observaciones}
                                    onChange={e => { this.setState({observaciones: e.target.value})}}
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
                                            emptyDataSourceMessage: 'No hay detalle en la factura.',
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
                                        { title: 'Id_orden_compra_detalle', field: 'id_orden_compra_detalle', hidden: true, cellStyle: { width: '5%' } },
                                        { title: 'Id_articulo', field: 'id_articulo', hidden: true, cellStyle: { width: '5%' } },
                                        { title: 'Cantidad', field: 'cantidad', cellStyle: { width: '10%' } },
                                        { title: 'Artículo', field: 'articulo', editable: 'never', cellStyle: { width: '70%' } },
                                        { title: 'Precio Unitario', field: 'precio_unitario', cellStyle: { width: '10%' } }
                                    ] }
                                    data={ this.state.detalleitemsfactura }     
                                    actions={[
                                        {
                                          icon: 'add',
                                          tooltip: 'Agregar detalle',
                                          isFreeAction: true,
                                          onClick: (event) => this.setState( {open_add: true} )
                                        }
                                      ]}  
                                    editable={{
                                        onRowUpdate: (newData, oldData) =>
                                          new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                              {
                                                const data = this.state.detalleitemsfactura;
                                                const index = data.indexOf(oldData);
                                                data[index] = newData;
                                                this.setState({ detalleitemsfactura: data }, () => resolve());
                                              }
                                              resolve()
                                            }, 1000)
                                          }),
                                        onRowDelete: oldData =>
                                          new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                              {
                                                let data = this.state.detalleitemsfactura;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.setState({ detalleitemsfactura: data }, () => resolve());
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

export default FacturaProveedor;