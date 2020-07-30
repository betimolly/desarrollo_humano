import React from "react";
import { Button, TextField, Grid, MenuItem, FormControl, FormLabel, FormGroup, Switch } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';

class ArticuloDatos extends React.Component {
    
    state = {
        id: 0,
        descripcion: '',
        perecedero: false,
        codigo_barra: '',
        cantidad_maxima: '',
        cantidad_minima: '',
        cantidad_unidad: '',
        id_subrubro: '',
        id_rubro: '',
        id_marca_articulo: '',
        unidad_medida: '',
        envase: '',

        rubros: [],
        subrubros: [],
        marcas: [],
        envases: [],
        unidades_medida: [],
        
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

    handleChangeRubro = (e) => {
        this.setState( {id_rubro: e.target.value} );
        this.props.onRubroChange (e.target.value);
        this.changeSubRubroId(e.target.value);
    };

    
    changeSubRubroId = (id) => {
        conn.loadsubrubros(id).then( response => { 
            this.setState( { subrubros: response.data } );
            
        });
    }

    handleChangeSubRubro = (e) => {
        this.setState( {id_subrubro: e.target.value} );
    };

    handleChangeMarca = (e) => {
        this.setState( {id_marca_articulo: e.target.value} );
    };

    handleChangeEnvase = (e) => {
        this.setState( {envase: e.target.value} );
    };
    

    handleChangeUnidadMedida = (e) => {
        this.setState( {unidad_medida: e.target.value} );
    };

    handleFormSubmit = () => {
        conn.savearticulo(this.state).then( response => {
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
                
                //Si no es un Módulo, limpio los campos, si lo es, dejo los datos y paso a cargar los artículos que lo componen. Paso el Id del artículo al padre.
                this.props.onAfterSave(response.data.id);
            
                if (this.props.id_rubro !== 1) {
                    this.setState({ id: 0,
                                    descripcion: '',
                                    perecedero: false,
                                    codigo_barra: '',
                                    cantidad_maxima: '',
                                    cantidad_minima: '',
                                    cantidad_unidad: '',
                                    id_subrubro: '',
                                    id_rubro: '',
                                    id_marca_articulo: '',
                                    unidad_medida: '',
                                    envase: '',
                            
                                    rubros: [],
                                    subrubros: [],
                                    unidades_medida: [],
                                    marcas: [],
                                    envases: [] });

                }
            }
         })
        .catch( error => { console.error(error) } );       
    };


    reloadArticulo = () => {
        //Verifico si es una edición
        //if (this.props.match.params.art) {
            if (this.props.id_art) {
                //conn.searchexactarticulo(this.props.match.params.art).then( response => { 
                conn.searchexactarticulo(this.props.id_art).then( response => { 
                    if (response.data.length > 0) {
                        const data = response.data[0];
                        this.setState( { id: data.id,
                                         descripcion: data.descripcion,
                                         perecedero: data.perecedero,
                                         codigo_barra: data.codigo_barra,
                                         cantidad_maxima: data.cantidad_maxima,
                                         cantidad_minima: data.cantidad_minima,
                                         cantidad_unidad: data.cantidad_unidad,
                                         id_subrubro: data.id_subrubro,
                                         id_rubro: data.id_rubro,
                                         id_marca_articulo: data.id_marca_articulo,
                                         unidad_medida: data.unidad_medida,
                                         envase: data.envase} );
    
                        this.changeSubRubroId(data.id_rubro);
    
                    }
                });
            }
    }


    componentDidUpdate(prevProps) {
        if (prevProps.id_art !== this.props.id_art) {
            if (this.props.id_art !== 0) {
                this.setState( { id: this.props.id_art } );
                //this.changeSubRubroId(this.props.id_rubro);
                this.reloadArticulo();
            }
        }
    }


    componentDidMount() {
        conn.loadrubros().then( response => { 
            this.setState( { rubros: response.data } );
        });
        conn.loadmarcas().then( response => { 
            this.setState( { marcas: response.data } );
        });
        conn.loadunidadmedida().then( response => { 
            this.setState( { unidades_medida: response.data } );
        });
        conn.loadenvases().then( response => { 
            this.setState( { envases: response.data } );
        });
        this.reloadArticulo();
    }

    
    render() {
        return (
            <React.Fragment >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Agregar Artículo</h2>
                    </Grid>
                    <Grid container spacing={3} item sm={12} xs={12}>
                        <Grid item sm={6} xs={12}>
                            <TextField select fullWidth
                                label="Seleccione Rubro"
                                id="ddlRubro"
                                className="labelleft"
                                value={this.state.id_rubro}
                                onChange={this.handleChangeRubro}
                                >
                                {
                                    this.state.rubros.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField select fullWidth
                                label="Seleccione SubRubro"
                                id="ddlSubRubro"
                                className="labelleft"
                                value={this.state.id_subrubro}
                                onChange={this.handleChangeSubRubro}
                                >
                                {
                                    this.state.subrubros.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField select fullWidth
                                label="Marca"
                                id="ddlMarca"
                                className="labelleft"
                                name="id_marca_articulo"
                                value={this.state.id_marca_articulo}
                                onChange={this.handleChangeMarca}
                                >
                                {
                                    this.state.marcas.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }    
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtDescripcion" fullWidth name="descripcion" label="Descripción" value={this.state.descripcion} onChange={e => this.setState({ descripcion: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item container justify="flex-start" sm={3} xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">¿Es Perecedero?</FormLabel>
                                <FormGroup>
                                    <Grid component="label" container alignItems="center" spacing={1}>
                                        <Grid item>No</Grid>
                                        <Grid item>
                                                <Switch
                                                    checked={this.state.perecedero}
                                                    onChange={e => { this.setState({perecedero: e.target.checked})}}
                                                    name="perecedero" 
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                        </Grid>
                                        <Grid item>Si</Grid>
                                    </Grid>
                                </FormGroup> 
                            </FormControl>        
                        </Grid>
                        <Grid item sm={9} xs={12}>
                            <TextField id="txtCodigoBarra" fullWidth name="codigo_barra" label="Código Barra" value={this.state.codigo_barra} onChange={e => this.setState({ codigo_barra: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtCantidadMaxima" fullWidth name="cantidad_maxima" label="Cantidad Máxima" value={this.state.cantidad_maxima} onChange={e => this.setState({ cantidad_maxima: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtCantidadMinima" fullWidth name="cantidad_minima" label="Cantidad Mínima" value={this.state.cantidad_minima} onChange={e => this.setState({ cantidad_minima: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField id="txtCantidadUnidad" fullWidth name="cantidad_unidad" label="Cantidad Unidad" value={this.state.cantidad_unidad} onChange={e => this.setState({ cantidad_unidad: e.target.value })} ></TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField select fullWidth
                                label="Seleccione Unidad de Medida"
                                id="ddlUnidadMedida"
                                className="labelleft"
                                name="unidad_medida"
                                value={this.state.unidad_medida}
                                onChange={this.handleChangeUnidadMedida}
                                >
                                {
                                    this.state.unidades_medida.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }   
                            </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField select fullWidth
                                label="Seleccione Envase del Artículo"
                                id="ddlEnvase"
                                className="labelleft"
                                name="envase"
                                value={this.state.envase}
                                onChange={this.handleChangeEnvase}
                                >
                                {
                                    this.state.envases.map(data=><MenuItem key={data.clave} value={data.clave}>{data.valor}</MenuItem>)
                                }  
                            </TextField>
                        </Grid>
                        <Grid item container justify="flex-start" xs={12}>
                            <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                        </Grid>
                        {/*</form>*/}
                    </Grid>                    
                </Grid> 
            </React.Fragment >
          
        )
    }
}

export default ArticuloDatos;