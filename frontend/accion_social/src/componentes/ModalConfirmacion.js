import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

class ModalConfirmacion extends React.Component {
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.dialog_title}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">{this.props.dialog_content}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.props.handleOk ? this.props.handleOk : this.props.handleClose} color="primary" autoFocus>
                    Aceptar
                </Button>
                </DialogActions>
            </Dialog>
        )    

    }
}
export default ModalConfirmacion;