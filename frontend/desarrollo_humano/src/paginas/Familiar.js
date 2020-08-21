import React from "react";
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import MaterialTable from 'material-table';
//import { Autocomplete } from "@material-ui/lab";
import PersonaDatos from "../componentes/PersonaDatos";
import conn from '../ServiceConexion';
import { getCuilCuit } from '../utils/Commons';

class Familiar extends React.Component {
    state = {
        persona : {
            id: 0,                          //clave primaria de la tabla familiar
            id_familiar: 0,                 //clave foránea de la tabla familiar del familiar 
            id_titular: this.props.id_pers, //clave foránea de la tabla familiar del titular
            nombre: '',
            apellido: '',
            ndoc: '',
            sexo: '',
            cuil: '',
            fecha_nacimiento: '',
            edad: '',
            calle: '',
            altura: '',
            id_barrio: '',
            barrio: '',
            parentesco: '',
            telefono: '',
            email: '',
            nacionalidad: '',
            tiempo_residencia: '',
            escolaridad: '',
            situacion_salud: '',
            titular: false
        },
        
        index: null,
        paises: [],
        familiares: [],
        open_add: false,
        options_pers: []
    };


    handleClickOpenAdd = () => {
        this.setState( { open_add: true, index: -1 } );
    };
    

    handleCloseAdd = () => {
        //const { index , familiares} = this.state;
        /*if (index && familiares[index].id === 0) {
            const newFamiliares = [
                ...familiares.slice(0, index), 
                ...familiares.slice(index + 1)
            ];
            this.setState({familiares: newFamiliares});
        }*/

        //Limpiar persona
        const persona = {
            id: 0,
            id_familiar: 0,
            id_titular: this.props.id_pers,
            nombre: '',
            apellido: '',
            ndoc: '',
            sexo: '',
            cuil: '',
            fecha_nacimiento: '',
            edad: '',
            calle: '',
            altura: '',
            id_barrio: '',
            barrio: '',
            parentesco: '',
            telefono: '',
            email: '',
            nacionalidad: '',
            tiempo_residencia: '',
            escolaridad: '',
            situacion_salud: '',
            titular: false
        };

        this.setState( { open_add: false, index: null, persona } );
    };


    handleAdd = () => {
        const { familiares, persona } = this.state;

        persona.id_titular = this.props.id_pers;
        conn.savefamiliar(persona).then( response => {

            if (!response.data.error) {
                let { index } = this.state;
                persona.id = response.data.id;
                persona.id_familiar = response.data.id_familiar; 

                if (index === null) {
                    index = familiares.length;
                    //familiares.push(persona);
                }
                //else {
                    const newFamiliares = [ 
                        ...familiares.slice(0, index), 
                        { ...persona },
                        ...familiares.slice(index + 1)];
                        //this.setState({  }); 
                //}

                //Limpiar persona
                const newpersona = {
                    id: 0,
                    id_familiar: 0,
                    id_titular: this.props.id_pers,
                    nombre: '',
                    apellido: '',
                    ndoc: '',
                    sexo: '',
                    cuil: '',
                    fecha_nacimiento: '',
                    edad: '',
                    calle: '',
                    altura: '',
                    id_barrio: '',
                    barrio: '',
                    parentesco: '',
                    telefono: '',
                    email: '',
                    nacionalidad: '',
                    tiempo_residencia: '',
                    escolaridad: '',
                    situacion_salud: '',
                    titular: false
                };
                
                this.setState({ open_add: false, persona: newpersona, index: null, familiares: newFamiliares });             
                
            }
         })
        .catch( error => { console.error(error) } );
    };

    
    componentDidMount() {
        conn.loadpaises().then( response => { 
            this.setState( { paises: response.data } );
        });

        //Verifico si es una edición
        if (this.props.id_pers) {
            conn.listafamiliaresbenef(this.props.id_pers).then( response => {
                if (!response.data.error) {
                    this.setState({ familiares : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    }

    /*getPersona = index => {
        let persona = this.state.persona;

        if (index !== null) {
            persona = this.state.familiares[index];
        }

        return persona;
    };*/

    // handleChangePersona = personaProp => {
    //     const { index, familiares } = this.state;
    //     const newpersona = {
    //         ...familiares[index], 
    //         ...personaProp
    //     };
    //     const newFamiliares = [ 
    //         ...familiares.slice(0, index), 
    //         newpersona,
    //         ...familiares.slice(index + 1)];
    //     this.setState({familiares: newFamiliares});
    // }

    handleChangePersona = personaProp => {
        const { persona } = this.state;
   
        const newpersona = {
            ...persona, 
            ...personaProp,
            id_familiar: personaProp.id ?? persona.id_familiar,
            id: persona.id
        };
        

        //Si no se modifica el cuil, lo calculo
        if ( !personaProp.cuil ) {
            newpersona.cuil = (newpersona.ndoc && newpersona.sexo && (newpersona.cuil === "" || !newpersona.cuil)) ? getCuilCuit(newpersona.ndoc, newpersona.sexo) : 0;
        }

        this.setState({persona: newpersona});
    }


    handleDeleteFamiliar = id => {
        conn.deletefamiliar(id).then( response => {
            if (response.data.error) {
                //TODO: Ver si mostrar mensaje 
            }
         })
        .catch( error => { console.error(error) } );
    }


    render() {
        //const { options_pers } = this.state;
        const { index } = this.state;
      
        return (
            <React.Fragment >
                <Dialog
                    open={this.state.open_add}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <DialogTitle id="alert-dialog-title"><b>Agregar/Editar {this.props.titulo}</b></DialogTitle>
                    <DialogContent>
                        <PersonaDatos persona={this.state.persona} es_familiar={true} es_edicion={ index!==null } onChange={this.handleChangePersona} />
                        {/*<Grid container spacing={1} item xs={12}>
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
                                <TextField id="txtTelefono" fullWidth name="telefono" label="Teléfono" value={this.state.telefono} onChange={this.handleChange} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtEmail" fullWidth name="email" label="Email" value={this.state.email} onChange={this.handleChange} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="ddlNacionalidad" select fullWidth name="nacionalidad" label="Nacionalidad/País" className="labelleft" value={this.state.nacionalidad} onChange={this.handleChange} >
                                    {   
                                        this.state.paises.map((data) => 
                                        <MenuItem key={data.id} value={data.nombre}>{data.nombre}</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtTiempoResidencia" fullWidth name="tiempo_residencia" label="Tiempo Residencia" value={this.state.tiempo_residencia} onChange={this.handleChange} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtEscolaridad" fullWidth name="escolaridad" label="Escolaridad" value={this.state.escolaridad} onChange={this.handleChange} ></TextField>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField id="txtSituacionSalud" fullWidth name="situacion_salud" label="Situación Salud" value={this.state.situacion_salud} onChange={this.handleChange} ></TextField>
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
                        </Grid>  */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAdd} color="primary" autoFocus>
                            Guardar
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
                                    emptyDataSourceMessage: 'No hay familiares cargados.',
                                    addTooltip: 'Agregar nuevo familiar',
                                    //editTooltip: 'Editar familiar',
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
                                { title: 'Id', field: 'id', hidden: true, cellStyle: { width: '5%' } },
                                { title: 'Id_familiar', field: 'id_familiar', hidden: true, cellStyle: { width: '5%' } },
                                { title: 'Nombre', field: 'nombre', cellStyle: { width: '30%' } },
                                { title: 'Apellido', field: 'apellido', editable: 'never', cellStyle: { width: '30%' } },
                                { title: 'DNI', field: 'ndoc', cellStyle: { width: '15%' } },
                                { title: 'Parentesco', field: 'parentesco', cellStyle: { width: '15%' } }
                            ] }
                            data={ this.state.familiares }    
                            //onRowClick={(evt, selectedRow) => alert(selectedRow)} 
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Agregar familiar',
                                    isFreeAction: true,
                                    onClick: (event) => {
                                        const index = null;
                                        //const persona = this.state.persona; // this.getPersona(index); // persona vacia
                                        this.setState( {open_add: true, index} );
                                    }
                                },
                                {
                                    icon: 'edit',
                                    tooltip: 'Editar familiar',
                                    onClick: (event, rowData) => {
                                        const index = rowData.tableData.id;
                                        const persona = this.state.familiares[index];// this.getPersona(index); // persona existente
                                        this.setState( {open_add: true, index, persona } );
                                    }
                                  }
                                ]}  
                            editable={{
                                /*onRowUpdate: (newData, oldData) =>
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
                                    }),*/
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.state.familiares;
                                                const index = data.indexOf(oldData);
                                                this.handleDeleteFamiliar(data[index].id);
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