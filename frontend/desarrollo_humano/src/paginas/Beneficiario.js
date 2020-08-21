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
import SituacionHabitacional from "./SituacionHabitacional";
import conn from '../ServiceConexion';
import { getCuilCuit } from '../utils/Commons';

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
            titular: true
        },

        situacion_hab: {
            id: 0,
            id_beneficiario: this.props.match.params.ben,
            situacion_calle: false,
            vivienda_anterior: '',
            conviviente_anterior: '',
            proyeccion_situacion: '',
            ubicacion_vivienda: '',
            tipo_vivienda: '',
            propiedad: '',
            comparte_vivienda: '',
            luz: false,
            gas: false,
            cloacas: false,
            agua_corriente: false,
            recoleccion_residuos: false,
            servicio_colectivo: false,
            cantidad_dormitorios: '',
            material_piso: '',
            material_pared: '',
            material_techo: '',
            banio: '',
            tipo_banio: '',
            agua_en_vivienda: false,
            tanque_agua: false,
            pilar_luz: false,
            conexion_electrica: false,
            tipo_calefaccion: '',
            coccion_alimentos: '',
            mejora_vivienda: ''
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

        //Si no se modifica el cuil, lo calculo
        if ( !personaProp.cuil ) {
            newpersona.cuil = (newpersona.ndoc && newpersona.sexo && (newpersona.cuil === "" || !newpersona.cuil)) ? getCuilCuit(newpersona.ndoc, newpersona.sexo) : 0;
        }
        this.setState({persona: newpersona});
    }
    

    handleChangeSituacion = situacionProp => {
        const { situacion_hab } = this.state;
        const newsituacion = {
            ...situacion_hab, 
            ...situacionProp
        };
        this.setState({situacion_hab: newsituacion});
    }

    /***** Stepper Inicio*****/    
    getSteps() {
        return ['Datos del Titular', 'Familiares', 'Documentación Digital', 'Situación Habitacional', 'Área Aptitudinal', 'Reporte'];
    }
      
    getStepContent = (stepIndex) => {
        const { t } = this.props.match.params;        
        
        switch (stepIndex) {
            case 0:
                return <PersonaDatos titulo="Titular de Derechos" persona={this.state.persona} es_edicion={ t ? true : false } onChange={this.handleChangePersona} />; 
            case 1:
                return <Familiar titulo="Familiares" id_pers={this.state.persona.id} />;
            case 2:
                return <FileUpload titulo="Archivos Adjuntos" id_legajo={this.state.persona.beneficiario} />; 
            case 3:
                return <SituacionHabitacional situacion_hab={this.state.situacion_hab} onChange={this.handleChangeSituacion} />; 
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
            case 3:
                this.handleFormSubmitSituacion();
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

    handleFormSubmitSituacion = () => { 
        conn.savesituacionhabitacional(this.state.situacion_hab).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else {
                const {situacion_hab} = this.state; 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    situacion_hab: {
                        ...situacion_hab, 
                        id: response.data.id 
                        //beneficiario: response.data.ben
                    }
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

    componentDidMount() {
        if (this.props.match.params.ben && this.props.match.params.t) {
            conn.searchexactpersona(this.props.match.params.t).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( {  persona: {...data, beneficiario: this.props.match.params.ben }  } );
                }
            });
            conn.searchsituacionhabitacional(this.props.match.params.ben).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({  situacion_hab: {
                                                    ...data, 
                                                    id_beneficiario: this.props.match.params.ben,
                                                    situacion_calle: (data.situacion_calle === 'S') ? true : false,
                                                    luz: (data.luz === 'S') ? true : false,
                                                    gas: (data.gas === 'S') ? true : false,
                                                    agua_corriente: (data.agua_corriente === 'S') ? true : false,  
                                                    cloacas: (data.cloacas === 'S') ? true : false,   
                                                    recoleccion_residuos: (data.recoleccion_residuos === 'S') ? true : false,    
                                                    servicio_colectivo: (data.servicio_colectivo === 'S') ? true : false,     
                                                    agua_en_vivienda: (data.agua_en_vivienda === 'S') ? true : false,     
                                                    tanque_agua: (data.tanque_agua === 'S') ? true : false,      
                                                    pilar_luz: (data.pilar_luz === 'S') ? true : false,      
                                                    conexion_electrica: (data.conexion_electrica === 'S') ? true : false 
                                                    }  
                                  });
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