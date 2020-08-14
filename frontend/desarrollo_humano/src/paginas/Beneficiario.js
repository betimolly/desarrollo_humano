import React from "react";
import { Button, Grid, Card, CardContent } from '@material-ui/core';
//import { Autocomplete } from "@material-ui/lab";
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
//import Typography from '@material-ui/core/Typography';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import PersonaDatos from "../componentes/PersonaDatos";
import Familiar from "./Familiar";
import FileUpload from "../componentes/FileUpload";
import conn from '../ServiceConexion';

const styles = {
    root: {
        width: '100%'
    },
    backButton: {
        //marginRight: theme.spacing(1),
        marginTop: '1em'
    },
    instructions: {
        //marginTop: theme.spacing(1),
        //marginBottom: theme.spacing(1),
    },
}

class Beneficiario extends React.Component {
    
    state = {
        //State persona
        persona: {
            id: 0,
            beneficiario: 0,
            nombre: '',
            apellido: '',
            ndoc: '',
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
            titular: true
        },

        activeStep: 0, 

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
    

    handleChangePersona = personaProp => {
        const { persona } = this.state;
        const newpersona = {
            ...persona, 
            ...personaProp
        };
        this.setState({persona: newpersona});
    }

    /***** Stepper Inicio*****/    
    getSteps() {
        return ['Datos del Titular', 'Familiares', 'Documentación Digital', 'Situación Habitacional', 'Área Aptitudinal', 'Reporte'];
    }
      
    getStepContent = (stepIndex) => {
        //const { t, ben } = this.props.match.params;        
        
        switch (stepIndex) {
            case 0:
                //'Datos Personales del titular de derechos...';
                return <PersonaDatos titulo="Titular" persona={this.state.persona} onChange={this.handleChangePersona} />; 
            case 1:
                return <Familiar titulo="Familiares" id_pers={this.state.persona.id} />;
            case 2:
                return <FileUpload titulo="Archivos Adjuntos" id_legajo={this.state.persona.beneficiario} />; 
            case 3:
                //'Carga de datos de vivienda...';
                return 'Datos de la vivienda'; 
            case 4:
                //'Carga aptitudinal...';
                return 'Datos Aptitudinales'; 
            case 5:
                //'Reporte final...';
                return 'Reporte'; 
            default:
                return 'FIN' ;
        }
    }

    handleNext = () => {
        switch (this.state.activeStep) {
            case 0:
                this.handleFormSubmit();
                break; 
            default: this.setState( { activeStep : this.state.activeStep + 1 });
                break;
        }
    };

    handleBack = () => {
        this.setState( { activeStep : this.state.activeStep - 1 });
    };
    /***** Stepper Fin*****/

    handleFormSubmit = () => {
        conn.savepersona(this.state.persona).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else {
                const {persona} = this.state; 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    persona: {
                        ...persona, 
                        id: response.data.id, 
                        beneficiario: response.data.ben
                    }
                });
            }
            //this.setState( { activeStep : this.state.activeStep + 1 });
         })
        .catch( error => { console.error(error) } );
    };

    componentDidMount() {
        if (this.props.match.params.ben && this.props.match.params.t) {
            conn.searchexactperson(this.props.match.params.t).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( {  persona: {...data, beneficiario: this.props.match.params.ben }  } );
                }
            });
        }
    }
    
    render() {
        
        const steps = this.getSteps();
        const { classes } = this.props; 

        return (
            <div className="App">
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />
                <Card className="Card" >
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item container justify="flex-start" xs={12}>
                                <h2>Historia de vida: Agregar/Editar Legajo</h2>
                            </Grid>
                            <div className={classes.root} >
                                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                    ))}
                                </Stepper> 
                                <div>
                                    {this.state.activeStep === steps.length ? (
                                    <div>
                                        <p>Todos los pasos completos</p>
                                    </div>
                                    ) : (
                                    <div>
                                        {this.getStepContent(this.state.activeStep)}
                                        <div className={classes.backButton}>
                                            <Button
                                                disabled={this.state.activeStep === 0}
                                                onClick={this.handleBack}
                                            >
                                            Volver
                                            </Button>
                                            <Button variant="contained" title={this.state.activeStep === 0 ? "Guardar y Continuar" : "Continuar"} onClick={this.handleNext} color="primary">
                                                {this.state.activeStep === steps.length - 1 ? 'Fin' : 'Siguiente'}
                                            </Button>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>                   
                        </Grid>
                    </CardContent>
                </Card >    
            </div>
        )
    }
}

export default withStyles(styles) (Beneficiario);