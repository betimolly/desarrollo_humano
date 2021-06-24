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
            //escolaridad: '',
            //situacion_salud: '',
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
            //escolaridad: '',
            //situacion_salud: '',
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
                }
                const newFamiliares = [ 
                    ...familiares.slice(0, index), 
                    { ...persona },
                    ...familiares.slice(index + 1)];

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
                    //escolaridad: '',
                    //situacion_salud: '',
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
            if (newpersona.ndoc && newpersona.sexo && (newpersona.cuil === "" || !newpersona.cuil)) {
                newpersona.cuil =  getCuilCuit(newpersona.ndoc, newpersona.sexo);
            }
        }

        //Si modifican el sexo, se calcula el cuil nuevamente
        if ( personaProp.sexo ) {
            if (newpersona.ndoc && newpersona.sexo) {
                newpersona.cuil =  getCuilCuit(newpersona.ndoc, newpersona.sexo);
            }
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
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Agregar familiar',
                                    isFreeAction: true,
                                    onClick: (event) => {
                                        const index = null;
                                        this.setState( {open_add: true, index} );
                                    }
                                },
                                {
                                    icon: 'edit',
                                    tooltip: 'Editar familiar',
                                    onClick: (event, rowData) => {
                                        const index = rowData.tableData.id;
                                        const persona = this.state.familiares[index];
                                        this.setState( {open_add: true, index, persona } );
                                    }
                                  }
                                ]}  
                            editable={{
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