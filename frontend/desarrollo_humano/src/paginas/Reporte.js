import React from "react";
import { TextField, Grid } from '@material-ui/core';
import ModalConfirmacion from "../componentes/ModalConfirmacion";

class Reporte extends React.Component {
    state = {
        dialog_title: '',
        dialog_content: '',
        open: false
    };
    

    handleClose = () => {
        this.setState( { open: false} );
    };


    handleChange = e => {
        const observaciones = e.target.value;
        this.props.onChange(observaciones);
    };


    render() {
        const { observaciones } = this.props;

        return (
            <div >
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} dialog_title={this.state.dialog_title} dialog_content={this.state.dialog_content} />

                <Grid container spacing={3} >
                    <Grid item container justify="flex-start" xs={12}>
                        <h2>Reporte</h2>
                    </Grid> 
                    <Grid item sm={12} xs={12}>
                        <TextField 
                            id="txtObservaciones" 
                            fullWidth 
                            name="observaciones" 
                            label="Observaciones" 
                            multiline
                            rows={8}
                            variant="outlined"
                            value={observaciones} 
                            onChange={this.handleChange} >
                        </TextField>
                    </Grid>                           
                </Grid>
            </div>
        )
    }
}

export default Reporte;