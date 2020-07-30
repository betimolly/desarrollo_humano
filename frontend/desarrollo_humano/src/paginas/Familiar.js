import React from "react";
import { Button, Grid, TextField, MenuItem,  Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Autocomplete } from "@material-ui/lab";
import conn from '../ServiceConexion';

class Familiar extends React.Component {
    state = {
        id_titular: 0,
        parentesco: '',
        familiares: [
                        { id_familiar: 1, nombre: 'Mehmet', apellido: 'Baran', dni: 12345678 },
                        { id_familiar: 2, nombre: 'Zerya Betül', apellido: 'Baran', dni: 99999999 },
                    ],
        open_add: false,
        options_pers: []
    };

    searchPersona = (e) => {
        if (e.target.value.length >= 4) {
            conn.searchpersona(e.target.value).then( response => {
                if (!response.data.error) {
                    this.setState({ options_pers : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersona = (e, newValue) => {
        this.setState({ id_titular: newValue.id })
    }    

    handleClickOpenAdd = () => {
        this.setState( { open_add: true} );
    };
    
    handleCloseAdd = () => {
        this.setState( { open_add: false} );
    };

    handleAdd = () => {
        const data = this.state.familiares;                                           
        const newData = {id_articulo: this.state.id_familiar, nombre: this.state.nombre, apellido: this.state.apellido, dni: this.state.dni };
        data.push(newData);
        this.setState({ familiares: data, open_add: false, id_familiar: '', nombre: '', apellido: '', dni: 0 });     
    };

    render() {
        const { options_pers } = this.state;
      
        return (
            <React.Fragment >
                <Dialog
                    open={this.state.open_add}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.titulo}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} item xs={12}>
                            <Grid item sm={6} xs={12}>
                                <Autocomplete
                                    inputValue={this.state.ndoc}
                                    onInputChange={this.searchPersona}
                                    loadingText='Cargando...'
                                    noOptionsText ="Sin datos"
                                    onChange={this.autocompleteChangePersona}
                                    getOptionLabel={option => option.ndoc ? option.ndoc.toString() : '' }
                                    renderInput={params => (
                                        <TextField {...params} id="txtNdoc" name="ndoc" label="Nro. Documento" fullWidth  />)}
                                    options={this.state.options_pers} />
                                    <small className="labelleft">Ingrese al menos 4 caracteres para iniciar la búsqueda.</small>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtNombre" fullWidth name="nombre" label="Nombre" value={this.state.nombre} onChange={e => this.setState({ nombre: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtApellido" fullWidth name="apellido" label="Apellido" value={this.state.apellido} onChange={e => this.setState({ apellido: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="ddlParentesco" select fullWidth name="parentesco" label="Parentesco" className="labelleft" value={this.state.parentesco} onChange={e => this.setState({ parentesco: e.target.value })} >
                                    <MenuItem value="Hijos">Hijo</MenuItem>
                                    <MenuItem value="Padres">Padres</MenuItem>
                                    <MenuItem value="Esposos">Esposos</MenuItem>
                                    <MenuItem value="Hermanos">Hermanos</MenuItem>
                                    <MenuItem value="Abuelos">Abuelos</MenuItem>
                                    <MenuItem value="Tíos">Tíos</MenuItem>
                                    <MenuItem value="Primos">Primos</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtFechaNacimiento" fullWidth name="fecha_nacimiento" label="Fecha Nacimiento" type="date" InputLabelProps={{ shrink: true, }} value={this.state.fecha_nacimiento} onChange={e => this.setState({ fecha_nacimiento: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtNacionalidad" fullWidth name="nacionalidad" label="Nacionalidad" value={this.state.nacionalidad} onChange={e => this.setState({ nacionalidad: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtFormacion" fullWidth name="formacion" label="Formación" value={this.state.formacion} onChange={e => this.setState({ formacion: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtIngresos" fullWidth name="ingresos" label="Ingresos" value={this.state.ingresos} onChange={e => this.setState({ ingresos: e.target.value })} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="ddlSituacionSalud" select fullWidth name="situacion_salud" label="Situación de Salud" className="labelleft" value={this.state.situacion_salud} onChange={e => this.setState({ situacion_salud: e.target.value })} >
                                    <MenuItem value="ObraSocial">Obra Social</MenuItem>
                                    <MenuItem value="Mutual">Mutual</MenuItem>
                                    <MenuItem value="Prepaga">Prepaga</MenuItem>
                                    <MenuItem value="Publico">Sistema Público</MenuItem>
                                    <MenuItem value="No">No Posee</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtObraSocial" fullWidth name="obra_social" label="Obra Social" value={this.state.obra_social} onChange={e => this.setState({ obra_social: e.target.value })} ></TextField>
                            </Grid>
                        </Grid>  
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAdd} color="primary" autoFocus>
                            Agregar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container spacing={3} >  
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>{this.props.titulo}</h2>
                    </Grid>                     
                    <Grid item xs={12}>
                        <MaterialTable
                            title="Datos del grupo familiar"
                            className="table table-striped"
                            localization={{
                                header: {
                                    actions: ''
                                },
                                body: {
                                    emptyDataSourceMessage: 'No hay detalle de familiares.',
                                    addTooltip: 'Agregar nuevo familiar',
                                    editTooltip: 'Editar familiar',
                                    deleteTooltip: 'Eliminar familiar',
                                    editRow: {
                                        deleteText: '¿Está seguro de eliminar este familiar?',
                                        cancelTooltip: 'Cancelar',
                                        saveTooltip: 'Guardar',
                                    }
                                }
                            }}      
                            options={{
                                search: false,
                                paging: false
                            }}
                            columns={ [
                                { title: 'Id_familiar', field: 'id_familiar', hidden: true, cellStyle: { width: '10%' } },
                                { title: 'Nombre', field: 'nombre', cellStyle: { width: '10%' } },
                                { title: 'Apellido', field: 'apellido', editable: 'never', cellStyle: { width: '70%' } },
                                { title: 'DNI', field: 'dni', cellStyle: { width: '10%' } }
                            ] }
                            data={ this.state.familiares }     
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Agregar familiar',
                                    isFreeAction: true,
                                    onClick: (event) => this.setState( {open_add: true} )
                                }
                                ]}  
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                        const data = this.state.familiares;
                                        const index = data.indexOf(oldData);
                                        data[index] = newData;
                                        this.setState({ familiares: data }, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                        let data = this.state.familiares;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({ familiares: data }, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                    }),
                                }}
                        />                              
                    </Grid>                  
                </Grid>

            </React.Fragment>
        )
    }
}

export default Familiar;