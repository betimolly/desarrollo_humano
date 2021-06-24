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
import SituacionEconomica from "./SituacionEconomica";
import SituacionHabitacional from "./SituacionHabitacional";
import SituacionSalud from "./SituacionSalud";
import SituacionEducacional from "./SituacionEducacional";
import SituacionJudicial from "./SituacionJudicial";
import Reporte from "./Reporte";
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
    stepCompleted: {
        color: 'lightgreen'
    },
    cursorPointer: {
        cursor: 'pointer !important'
    }
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

        situacion_economica: {
            id: 0,
            id_beneficiario: this.props.match.params.ben,
            titular_trabaja: false,
            actividad: '',
            formal: false,
            ingreso_fijo: false,
            familiar_trabaja: false,
            actividad_familiar: '',
            formal_familiar: false,
            ingreso_fijo_familiar: false,
            percibe_alimentos_estado: false,
            retira_alimentos: false,
            percibe_alimentos_soc: false,
            alimentacion_menores: false,
            lista_percibe: []
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

        situacion_salud: {
            id: 0,
            id_beneficiario: this.props.match.params.ben,
            enfermedad: '',
            lugar_tratamiento: '',
            enfermedad_familiar: '',
            lugar_tratamiento_familiar: '',
            familiar_discapacitado: false,
            posee_certificado: false,
            obra_social: '',
            medicacion: '',
            medico: '',
            posee_pase_transporte: false,
            referente: ''
        },

        situacion_edu: {
            id: 0,
            id_beneficiario: this.props.match.params.ben,
            cantidad_escolarizado: '',
            ultimo_nivel_escolarizado: '',
            establecimiento_educativo: '',
            concurren_centro_municipal: false,
            apoyo_pedagogico: false,
            etap: false,
            actividad_familiar: '',
            institucion_concurre: ''
        },

        situacion_judicial: {
            id: 0,
            id_beneficiario: this.props.match.params.ben,
            proceso_judicial: false,
            ambito_proceso_judicial: '',
            profesional_interviniente: '',
            institucion_concurre: ''
        },

        observaciones: '',
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
    

    handleChangeEconomica = situacionProp => {
        const { situacion_economica } = this.state;
        const newsituacion = {
            ...situacion_economica, 
            ...situacionProp
        };
        this.setState({situacion_economica: newsituacion});
    }
    

    handleChangeHabitacional = situacionProp => {
        const { situacion_hab } = this.state;
        const newsituacion = {
            ...situacion_hab, 
            ...situacionProp
        };
        this.setState({situacion_hab: newsituacion});
    }
    

    handleChangeSalud = situacionProp => {
        const { situacion_salud } = this.state;
        const newsituacion = {
            ...situacion_salud, 
            ...situacionProp
        };
        this.setState({situacion_salud: newsituacion});
    }
    

    handleChangeEducacional = situacionProp => {
        const { situacion_edu } = this.state;
        const newsituacion = {
            ...situacion_edu, 
            ...situacionProp
        };
        this.setState({situacion_edu: newsituacion});
    }
    

    handleChangeJudicial = situacionProp => {
        const { situacion_judicial } = this.state;
        const newsituacion = {
            ...situacion_judicial, 
            ...situacionProp
        };
        this.setState({situacion_judicial: newsituacion});
    }
    

    handleChangeObs = obs => {
        this.setState({observaciones: obs});
    }


    /***** Stepper Inicio*****/    
    getSteps() {
        return ['Datos del Titular', 'Familiares', 'Situación Económica', 'Situación Habitacional', 'Situación Salud', 'Situación Educativa', 'Situación Judicial', 'Documentación Digital', 'Reporte'];
    }
      
    getStepContent = (stepIndex) => {
        const { t } = this.props.match.params;        
        
        switch (stepIndex) {
            case 0:
                return <PersonaDatos titulo="Titular de Derechos" persona={this.state.persona} es_edicion={ t ? true : false } onChange={this.handleChangePersona} />; 
            case 1:
                return <Familiar titulo="Familiares" id_pers={this.state.persona.id} />;
            case 2:
                return <SituacionEconomica situacion_economica={this.state.situacion_economica} onChange={this.handleChangeEconomica} />; 
            case 3:
                return <SituacionHabitacional situacion_hab={this.state.situacion_hab} onChange={this.handleChangeHabitacional} />; 
            case 4:
                return <SituacionSalud situacion_salud={this.state.situacion_salud} onChange={this.handleChangeSalud} />; 
            case 5:
                return <SituacionEducacional situacion_edu={this.state.situacion_edu} onChange={this.handleChangeEducacional} />; 
            case 6:
                return <SituacionJudicial situacion_judicial={this.state.situacion_judicial} onChange={this.handleChangeJudicial} />;
            case 7:
                return <FileUpload titulo="Archivos Adjuntos" id_legajo={this.state.persona.beneficiario} />; 
            case 8:
                return <Reporte id_legajo={this.state.persona.beneficiario} observaciones={this.state.observaciones} onChange={this.handleChangeObs} />;
            default:
                return '' ;
        }
    }

    handleNext = () => {
        switch (this.state.activeStep) {
            case 0:
                this.handleFormSubmit();
                break; 
            case 2:
                this.handleFormSubmitEconomico();
                break; 
            case 3:
                this.handleFormSubmitHabitacional();
                break; 
            case 4:
                this.handleFormSubmitSalud();
                break; 
            case 5:
                this.handleFormSubmitEducacional();
                break;  
            case 6:
                this.handleFormSubmitJudicial();
                break;  
            case 8:
                this.handleFormSubmitObservacion();
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

    handleFormSubmitEconomico = () => { 
        const {situacion_economica} = this.state; 
        conn.savesituacioneconomica(situacion_economica).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else {
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    situacion_economica: {
                        ...situacion_economica, 
                        id: response.data.id,
                        lista_percibe: []
                    }
                });
            }
        })
        .catch( error => { console.error(error) } );
    };

    handleFormSubmitHabitacional = () => { 
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

    handleFormSubmitSalud = () => { 
        conn.savesituacionsalud(this.state.situacion_salud).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else {
                const {situacion_salud} = this.state; 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    situacion_salud: {
                        ...situacion_salud, 
                        id: response.data.id 
                        //beneficiario: response.data.ben
                    }
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

    handleFormSubmitEducacional = () => { 
        const {situacion_edu} = this.state;
        conn.savesituacioneducacion(situacion_edu).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else { 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    situacion_edu: {
                        ...situacion_edu, 
                        id: response.data.id 
                    }
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

    handleFormSubmitJudicial = () => { 
        const {situacion_judicial} = this.state;
        conn.savesituacionjudicial(situacion_judicial).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else { 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1,
                    situacion_judicial: {
                        ...situacion_judicial, 
                        id: response.data.id 
                    }
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

    handleFormSubmitObservacion = () => { 
        conn.saveobservacionbenef(this.state.observaciones, this.state.persona.beneficiario).then( response => {
            if (response.data.error) {
                this.setState({error : response.data.error, dialog_title : "Error", dialog_content : "Error al guardar o actualizar los datos.", open: true});
            }
            else { 
                this.setState({
                    dialog_title : "Confirmación", 
                    dialog_content : "Los datos se han guardado o actualizado correctamente.", 
                    open: true,
                    activeStep : this.state.activeStep + 1
                });
            }
         })
        .catch( error => { console.error(error) } );
    };

    cambioDirectoStep = (index) => {
        if (this.state.persona.beneficiario !== 0) {
            this.setState( {activeStep: index} );
            this.getStepContent(this.state.activeStep);
        }
    }

    componentDidMount() {
        if (this.props.match.params.ben && this.props.match.params.t) {
            conn.searchexactpersona(this.props.match.params.t).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( {  persona: {...data, beneficiario: this.props.match.params.ben }  } );
                }
            });
            conn.searchsituacioneconomica(this.props.match.params.ben).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({ situacion_economica: {
                                        ...data, 
                                        id_beneficiario: this.props.match.params.ben,
                                        titular_trabaja: (data.titular_trabaja === 'S') ? true : false,
                                        formal: (data.formal === 'S') ? true : false,
                                        ingreso_fijo: (data.ingreso_fijo === 'S') ? true : false,
                                        familiar_trabaja: (data.familiar_trabaja === 'S') ? true : false,
                                        formal_familiar: (data.formal_familiar === 'S') ? true : false,
                                        ingreso_fijo_familiar: (data.ingreso_fijo_familiar === 'S') ? true : false,
                                        percibe_alimentos_estado: (data.percibe_alimentos_estado === 'S') ? true : false,
                                        retira_alimentos: (data.retira_alimentos === 'S') ? true : false,
                                        percibe_alimentos_soc: (data.percibe_alimentos_soc === 'S') ? true : false,
                                        alimentacion_menores: (data.alimentacion_menores === 'S') ? true : false,
                                    }  
                                  });
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
            conn.searchsituacionsalud(this.props.match.params.ben).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({ situacion_salud: {
                                        ...data, 
                                        id_beneficiario: this.props.match.params.ben,
                                        familiar_discapacitado: (data.familiar_discapacitado === 'S') ? true : false,
                                        posee_certificado: (data.posee_certificado === 'S') ? true : false,
                                        posee_pase_transporte: (data.posee_pase_transporte === 'S') ? true : false,
                                    }                             
                                  });
                }
            });
            conn.searchsituacioneducacional(this.props.match.params.ben).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({ situacion_edu: {
                                        ...data, 
                                        id_beneficiario: this.props.match.params.ben,
                                        concurren_centro_municipal: (data.concurren_centro_municipal === 'S') ? true : false,
                                        apoyo_pedagogico: (data.apoyo_pedagogico === 'S') ? true : false,
                                        etap: (data.etap === 'S') ? true : false,
                                    }                             
                                  });
                }
            });
            conn.searchsituacionjudicial(this.props.match.params.ben).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState({ situacion_judicial: {
                                        ...data, 
                                        id_beneficiario: this.props.match.params.ben,
                                        proceso_judicial: (data.proceso_judicial === 'S') ? true : false
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
                                <h2>Historia de vida: Agregar/Editar Legajo{`${this.state.persona.nombre ? ' - ' : ''}${this.state.persona.nombre} ${this.state.persona.apellido}` }</h2>
                            </Grid>
                            <div className={classes.root} >
                                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                                    {steps.map((label, index) => (
                                    <Step onClick={ e => {this.cambioDirectoStep(index)} } key={label}>
                                        <StepLabel className={classes.cursorPointer}>{label}</StepLabel>
                                    </Step>
                                    ))}
                                </Stepper> 
                                <div>
                                    {/*{this.state.activeStep === steps.length ? (
                                    <div>
                                        <p>Todos los pasos completos</p>
                                    </div>
                                    ) : (*/}
                                    <div>
                                        {this.getStepContent(this.state.activeStep)}
                                        <div className={classes.backButton}>
                                            <Button
                                                disabled={this.state.activeStep === 0}
                                                onClick={this.handleBack}
                                            >
                                            Volver
                                            </Button>
                                            
                                            {this.state.activeStep !== steps.length &&
                                                <Button variant="contained" title={this.state.activeStep === 0 ? "Guardar y Continuar" : "Continuar"} onClick={this.handleNext} color="primary">
                                                    {this.state.activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                    {/*})}*/}
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