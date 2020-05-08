import React from "react";
import { Button, TextField, Grid, Card, CardContent, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import conn from '../ServiceConexion';


class ModuloArticulo extends React.Component {
    
    state = {
        id: 0,
        //nombre_modulo: '',
        id_articulo: 0,
        articulo: '',
        cantidad: 0,

        lista_articulos: [],
        options_articulos: [],

        valor_search: '',
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

    handleFormSubmit = () => {
        conn.savemoduloarticulos(this.state).then( response => {
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
                                id_articulo: 0,
                                articulo: '',
                                cantidad: 0, 
                                //nombre_modulo: '',
                                lista_articulos: [],
                                valor_search: '' });
            }
         })
        .catch( error => { console.error(error) } );       
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


    addArticuloToList = () => {
        if (this.state.articulo !== "") {
            this.setState({ lista_articulos: this.state.lista_articulos.concat({  id: this.state.id_articulo, articulo: this.state.articulo, cantidad: this.state.cantidad }),
                            id_articulo: 0,
                            articulo: '',
                            cantidad: 0,
                            valor_search: ''
                          });
        }
    }


    deleteArticulo = (idx) => {
        this.setState({ lista_articulos: this.state.lista_articulos.filter((todo, index) => idx !== index) });
    }
    
    loadData = async (id) => {
        let result = await conn.listaarticulosmodulo(id);
        this.setState( { lista_articulos: result.data } );
    };

    componentDidMount() {
        //Verifico si es una edición
        if (this.props.id_art) {
            this.loadData(this.props.id_art);
            this.setState({ id: this.props.id_art });
        }
    }

    
    render() {
        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                
                <Card className="Card" >
                    <h2>Artículos del Módulo</h2>
                    {/*<Paper style={{ margin: 16, padding: 16 }}>
                        <Grid container>
                            <Grid xs={12} md={12} item style={{ paddingRight: 16 }}>
                                <TextField
                                    label="Nombre Módulo"
                                    placeholder="Nombre Módulo"
                                    value={this.state.nombre_modulo}
                                    onChange={e => { this.setState({nombre_modulo: e.target.value})}}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Paper>*/}
                    <Paper style={{ margin: 16, padding: 16 }}>
                        <Grid container>
                            <Grid display="inline" xs={9} md={9} item style={{ paddingRight: 16 }}>
                                <Autocomplete 
                                    noOptionsText ="Sin datos"
                                    inputValue={this.state.valor_search} 
                                    onChange={this.autocompleteChangeArticulo}
                                    onInputChange={this.SearchArticulosModulos}
                                    getOptionLabel={option => option.articulo.toString()}
                                    getOptionSelected={(option, value) => option.articulo === value.articulo}    
                                    options={this.state.options_articulos}
                                    renderInput={params => (
                                        <TextField {...params} id="txtArticulo" name="articulo" label="Buscar Artículo" 
                                         />)}
                                    />    
                            </Grid>
                            <Grid display="inline" xs={2} md={2} item style={{ paddingRight: 16 }}>
                                <TextField
                                    label="Cantidad"
                                    placeholder="Cantidad"
                                    value={this.state.cantidad}
                                    onChange={e => { this.setState({cantidad: e.target.value})}}
                                    fullWidth
                                />
                            </Grid>
                            <Grid display="inline" xs={1} md={1} item style={{ paddingRight: 16 }}>
                                <IconButton color="primary" aria-label="Agregar Artículo al Módulo" title="Agregar Artículo al Módulo" onClick={this.addArticuloToList} >
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>    
                    {this.state.lista_articulos.length > 0 && (
                        <Paper style={{ margin: 16 }}>
                            <List style={{ overflow: "scroll" }}>
                            {this.state.lista_articulos.map((item, idx) => (
                                <ListItem key={item.id} divider={idx !== this.state.lista_articulos.length - 1}>
                                    <ListItemText primary={item.articulo} secondary={`Cantidad: ${item.cantidad}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Borrar artículo" onClick={() => this.deleteArticulo(idx)} >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            </List>
                        </Paper>
                    )}
                    <CardContent>
                        <Grid item container justify="flex-start" xs={12}>
                            <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                        </Grid>
                    </CardContent>
                </Card >
            </div>
        )
    }
}

export default ModuloArticulo;