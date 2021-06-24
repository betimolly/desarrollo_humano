import React from "react";
import { Button, Grid, Card, CardContent } from '@material-ui/core';
import PersonaDatos from "../componentes/PersonaDatos";
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';
import { getCuilCuit } from '../utils/Commons';

class Persona extends React.Component {
    state = {
        persona: {
            id: 0,
            beneficiario: 0,
            nombre: '',
            apellido: '',
            ndoc: '',
            sexo: '',
            cuil: '',
            fecha_nacimiento: '',
            parentesco: '',
            edad: '',
            telefono: '',
            email: '',
            calle: '',
            altura: '',
            id_barrio: '',
            barrio: '',
            nacionalidad: '',
            tiempo_residencia: '',
            escolaridad: '',
            situacion_salud: '',
            titular: false
        },
        open: false,
        dialog_title: '', 
        dialog_content: ''
    };

    handleClickOpen = () => {
        this.setState( { open: true} );
    };
    
    handleClose = () => {
        this.setState( { open: false} );
    };
    

    handleChangePersona = personaProp => {
        const { persona } = this.state;
        
        const newpersona = {
            ...persona, 
            ...personaProp
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

    handleFormSubmit = () => {
        conn.savepersona(this.state.persona).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else { 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    persona: {
                        id: 0,
                        beneficiario: 0,
                        nombre: '',
                        apellido: '',
                        ndoc: '',
                        sexo: '',
                        cuil: '',
                        fecha_nacimiento: '',
                        parentesco: '',
                        edad: '',
                        telefono: '',
                        email: '',
                        calle: '',
                        altura: '',
                        id_barrio: '',
                        barrio: '',
                        nacionalidad: '',
                        tiempo_residencia: '',
                        escolaridad: '',
                        situacion_salud: '',
                        titular: false
                    }
                });
            }
         })
        .catch( error => { console.error(error) } );
    };


    componentDidMount() {
        if (this.props.match.params.pers) {
            conn.searchexactpersona(this.props.match.params.pers).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({ persona: {...data} })
                }
            });
        }
    }

    render() {      
        return (
            <div className="App" >
                <Card className="Card" >
                    <CardContent>
                        <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <PersonaDatos titulo="Persona" persona={this.state.persona} es_edicion={ false } onChange={this.handleChangePersona} />
                            </Grid>
                            <Grid item container justify="flex-start" xs={12}>
                                <Button variant="contained" color="primary" onClick={e => this.handleFormSubmit(e)} >Guardar</Button>
                            </Grid>
                        </Grid>
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;