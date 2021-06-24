import React from "react";
import { Button, TextField, MenuItem, Grid, Card, CardContent, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import MaterialTable from 'material-table';
import { getUserId } from '../utils/Commons';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class RemitoBeneficiario extends React.Component {
    state = {
        id: 0,
        fecha_emision: '',
        fecha_entrega: '',
        forma_entrega: '',
        observaciones: '',
        usuario: getUserId(),
        id_solicitud: '',
        solicitud: '',
        id_articulo: '',
        articulo: '',
        cantidad: '',

        options_solicitudes: [],
        detalleremito: [],

        dialog_title: '',
        dialog_content: '',
        open: false
    };
    
    
    //Al seleccionar la solicitud del listado desplegado
    handleChangeSolicitud = (e, newValue) => {
        if (newValue) {
            this.setState( {id_solicitud: newValue.id_solicitud, solicitud: newValue.solicitud} );
        }
    };

    //Al tipear el nombre de la solicitud
    onChangeSolicitud = (e,newValue, reason) => {
        //if(e && e.type && e.type === 'change'){
            this.setState({ solicitud: newValue })
        //}
    }
    
    handleAdd = () => {
        const data = this.state.detalleremito;                                           
        const newData = {id_articulo: this.state.id_articulo, cantidad: this.state.cantidad, articulo: this.state.articulo };
        data.push(newData);
        this.setState({ detalleremito: data, open_add: false, id_articulo: '', cantidad: 0, articulo: '' });     
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

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };

    handleFormSubmit = () => {
        conn.saveremitobenef(this.state).then( response => {
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
                                fecha_emision: '',
                                fecha_entrega: '',
                                forma_entrega: '',
                                observaciones: '',
                                id_solicitud: '',
                                solicitud: ''});
            }
         })
        .catch( error => { console.error(error) } );
    };


    componentDidMount() {
        conn.loadsolicitudes().then( response => { 
            this.setState( { options_solicitudes: response.data } );
        });

        if (this.props.match.params.id) {
            conn.searchremitobenef(this.props.match.params.id).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( {id: data.id,
                                    fecha_emision: data.fecha_emision,
                                    fecha_entrega: data.fecha_entrega,
                                    forma_entrega: data.forma_entrega,
                                    observaciones: data.observaciones,
                                    id_solicitud: data.id_solicitud,
                                    solicitud: data.solicitud,
                                    detalleremito: data.detalleremito } );
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
                                <TextField id="txtCantidad" fullWidth name="cantidad" label="Cantidad" value={this.state.cantidad} onChange={e => this.setState({ cantidad: e.target.value })} ></TextField>
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
                        <Grid container >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Remito de Beneficiario</h2>
                            </Grid>
                            <Grid container spacing={1} item xs={12}>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtFechaEmision" fullWidth name="fecha_emision" label="Fecha Emisión" type="date" InputLabelProps={{ shrink: true }} value={this.state.fecha_emision} onChange={e => this.setState({ fecha_emision: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="txtFechaEntrega" fullWidth name="fecha_entrega" label="Fecha Entrega" type="date" InputLabelProps={{ shrink: true }} value={this.state.fecha_entrega} onChange={e => this.setState({ fecha_entrega: e.target.value })} ></TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <TextField id="ddlFormaEntrega" fullWidth select name="forma_entrega" className="labelleft" label="Forma Entrega" value={this.state.forma_entrega} onChange={e => this.setState({ forma_entrega: e.target.value })} >
                                        <MenuItem value="1">Mesa de Entrada</MenuItem>
                                        <MenuItem value="2">Reparto</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item sm={6} xs={12}>      
                                    <Autocomplete
                                        inputValue={this.state.solicitud}
                                        onChange={this.handleChangeSolicitud}
                                        onInputChange={ this.onChangeSolicitud }
                                        options={this.state.options_solicitudes}
                                        getOptionLabel={(option) => option.solicitud}
                                        renderInput={(params) => <TextField {...params} label="Solicitud"  />}
                                        />
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <TextField 
                                        id="txtObservaciones" 
                                        fullWidth 
                                        name="observaciones" 
                                        label="Observaciones" 
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        value={this.state.observaciones} 
                                        onChange={e => this.setState({ observaciones: e.target.value })} >
                                    </TextField>
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
                                                emptyDataSourceMessage: 'No hay detalle en el remito.',
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
                                            { title: 'Cantidad', field: 'cantidad', cellStyle: { width: '20%' } },
                                            { title: 'Artículo', field: 'articulo', editable: 'never', cellStyle: { width: '70%' } }
                                        ] }
                                        data={ this.state.detalleremito }     
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
                                                    const data = this.state.detalleremito;
                                                    const index = data.indexOf(oldData);
                                                    data[index] = newData;
                                                    this.setState({ detalleremito: data }, () => resolve());
                                                }
                                                resolve()
                                                }, 1000)
                                            }),
                                            onRowDelete: oldData =>
                                            new Promise((resolve, reject) => {
                                                setTimeout(() => {
                                                {
                                                    let data = this.state.detalleremito;
                                                    const index = data.indexOf(oldData);
                                                    data.splice(index, 1);
                                                    this.setState({ detalleremito: data }, () => resolve());
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
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default RemitoBeneficiario;