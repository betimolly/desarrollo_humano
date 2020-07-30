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
        id: 0,
        es_persona_institucion: '',
        id_pers_inst: '',
        descripcion: '',
        nombre: '',
        es_beneficiario_1: '',
        es_beneficiario_2: '',
        es_beneficiario_3: '',
        tipo_beneficio_1: '',
        tipo_beneficio_2: '',
        tipo_beneficio_3: '',
        fecha_alta: '',
        observaciones: '',

        pers_inst_obj: {id_pers_inst: '', descripcion: ''},
        tipos_de_beneficiarios_1: [],
        tipos_de_beneficiarios_2: [],
        tipos_de_beneficiarios_3: [],
        lista_personas_instituciones: [],
        
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
    

    handleChangeTipo = (e) => {
        this.setState({es_persona_institucion: e.target.value, lista_personas_instituciones: [] });
    };

    searchPersonaInstitucion = (e, pers_inst) => {
        this.setState({ descripcion : pers_inst});

        if ((e !== null) && (e.target.value.length >= 4)) {
            conn.searchpersonainstitucion(this.state.es_persona_institucion, e.target.value).then( response => {
                if (!response.data.error) {
                    this.setState({ lista_personas_instituciones : response.data});
                }
             })
            .catch( error => { console.error(error) } );
        }
    } 

    autocompleteChangePersonaInstitucion = (e, newValue) => {
        if (newValue !== null) {
            this.setState({id_pers_inst: newValue.numero, descripcion: newValue.descripcion});
            this.setState({pers_inst_obj: {id_pers_inst: newValue.numero, descripcion: newValue.descripcion} });
        }
    }

    /***** Stepper Inicio*****/    
    getSteps() {
        return ['Datos del Titular', 'Familiares', 'Documentación Digital', 'Datos Vivienda'];
    }
      
    getStepContent = (stepIndex) => {
        const { t } = this.props.match.params;        
        
        switch (stepIndex) {
            case 0:
                return <PersonaDatos titulo="Titular" id_pers={t} />; //'Datos Personales del titular de derechos...';
            case 1:
                return <Familiar titulo="Familiares" wizard />;
            case 2:
                return <FileUpload titulo="Archivos Adjuntos" />; 
            case 3:
                return <FileUpload />; //'Carga de datos de vivienda...';
            default:
                return '<h1>CHAU</h1>' ;
        }
    }
    handleNext = () => {
        this.setState( { activeStep : this.state.activeStep + 1 });
    };
    handleBack = () => {
        this.setState( { activeStep : this.state.activeStep - 1 });
    };
    /***** Stepper Fin*****/

    componentDidMount() {
        if (this.props.match.params.ben && this.props.match.params.t) {
// setState id_pers...

            conn.searchexactperson(this.props.match.params.t).then( response => {
                if (response.data.length > 0) {
                    const data = response.data[0];
                    this.setState( { 
                                     id: data.id,
                                     es_persona_institucion: data.tipo,
                                     id_pers_inst: data.id_beneficiario,
                                     nombre: data.nombre,
                                     descripcion: data.descripcion,
                                     fecha_alta: data.fecha_alta,
                                     observaciones: data.observaciones,
                                     pers_inst_obj: {id_pers_inst: data.id_pers_inst, descripcion: data.descripcion},
                                    } );
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
                                        {/*<Button onClick={this.handleReset}>Inicio</Button>*/}
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
                                            <Button variant="contained" color="primary" onClick={this.handleNext}>
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