import React from "react";
import { Grid, Card, CardContent, Link, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage, faFileWord, faFileAlt, faFilePdf, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons'
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
//import IconButton from '@material-ui/core/IconButton';
import conn from '../ServiceConexion';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    display: "none"
  },
  button: {
    color: blue[900],
    margin: 10
  },
  title: {
    display: "flex",
    alignItems: "start"
  },
  subtitle: {
    //display: "flex"
  },
  actionMargin: {
    margin: 10,
    color: "black",
    fontSize: '1em' 
  }
});

class FileUpload extends React.Component {

    state = {
        //mainState: "initial", 
        imageUploaded: 0,
        selectedFile: null,

        descripcion: '',
        open: false,
        open_descripcion: false,
        a_borrar: '',
        a_editar: false,

        archivos: [],
        secondary: false
    };


    getIcon = data => {   
        const Components = {
            faFileWord: faFileWord,
            faFilePdf: faFilePdf,
            faFileImage: faFileImage,
            faFileAlt: faFileAlt
        };
        return <FontAwesomeIcon icon={Components[data]} />     
    };    


    handleUploadClick = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function(e) {
          this.setState({
            selectedFile: [reader.result]
          });
          conn.uploadfileserver(this.props.id_legajo, file.name, reader.result).then( response => { 
            if (!response.data.error) {
              const data = this.state.archivos;                                           
              //const newData = {id: response.data.id, archivo: file.name, path: "archivos/"+this.props.id_legajo+"/"+file.name };
              const newData = {id: response.data.id, archivo: file.name, path: "/desarrollo_humano/archivos/"+response.data.id+"/"+file.name };
              data.push(newData);
              this.setState({ archivos: data }); 
            }
          });
        }.bind(this);

        this.setState({
          //mainState: "uploaded",
          selectedFile: event.target.files[0],
          imageUploaded: 1
        });
    };


    renderSwitch = archivo => {
      const extension = archivo.substring(archivo.indexOf(".")).toLowerCase();
      switch (extension) {
        case ".jpg": 
        case ".jpeg":
        case ".bmp":
        case ".png":
        case ".tiff":
            return this.getIcon("faFileImage");
        case ".txt":
        case ".doc":  
            return this.getIcon("faFileWord");
        case ".pdf":
            return this.getIcon("faFilePdf");
        default:
            return this.getIcon("faFileAlt");
      }  
    };

    handleOpenDescrip = () => {
      this.setState({ open_descripcion: true });
    }
    
    handleCloseDescrip = () => {
        this.setState( { open_descripcion: false} );
    };

    handleChangeDescrip = () => {
      const { archivos, descripcion, a_editar } = this.state;
      const archivo = archivos[a_editar];
      const id_archivo = archivos[a_editar].id;

      conn.modifydescriptionfile(id_archivo, descripcion).then( response => { 
        if (response.data.length > 0) {
          const archivos_new = [ ...archivos.slice(0, a_editar), 
            {...archivo, descripcion},
            ...archivos.slice(a_editar + 1)];
          this.setState({ descripcion: '',  open_descripcion: false, archivos: archivos_new});
        }
      });
    }

    handleDelete = () => {
      const { archivos, a_borrar } = this.state;
      const id_archivo = archivos[a_borrar].id;

      conn.deletefile(id_archivo).then( response => { 
        if (response.data.length > 0) {
          const archivos_new = [ ...archivos.slice(0, a_borrar), ...archivos.slice(a_borrar + 1)];
          this.setState({ archivos: archivos_new, open: false });
        }
      });
    }


    loadData = (id) => {
        conn.loadFilesFromLegajo(this.props.id_legajo).then( response => {
          if (response.data.length > 0) {
            this.setState( { archivos: response.data } );
          }
        })
    } 

    
    componentDidUpdate(prevProps) {
        if (prevProps.id_legajo !== this.props.id_legajo) {
            if (this.props.id_legajo !== 0) {
                //this.setState( { id: this.props.id_legajo } );
                this.loadData(this.props.id_legajo);
            }
        }
    }
    

    componentDidMount() {
      if (this.props.id_legajo) {
        this.loadData(this.props.id_legajo);
        /*conn.loadFilesFromLegajo(this.props.id_legajo).then( response => {
          if (response.data.length > 0) {
            this.setState( { archivos: response.data } );
          }
        })*/
      };
    }


    render() {
      const { classes } = this.props;
        return (
            <React.Fragment>
              <ModalConfirmacion open={this.state.open} handleOk={this.handleDelete} dialog_title="Eliminar Archivo" dialog_content="¿Desea eliminar este archivo?" /> 
              <Dialog
                  open={this.state.open_descripcion}
                  onClose={this.handleCloseDescrip}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  maxWidth="lg"
              >
                  <DialogTitle id="alert-dialog-title">Agregar descripción del archivo</DialogTitle>
                  <DialogContent>
                      <Grid container spacing={1} >
                          <Grid item sm={12} xs={12}>
                              <TextField id="txtDescripcion" fullWidth name="descripcion" label="Ingrese texto" inputProps={{maxlength: 50}} value={this.state.descripcion} onChange={e => this.setState({ descripcion: e.target.value })} ></TextField>
                          </Grid> 
                      </Grid>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleChangeDescrip} color="primary" autoFocus>
                          Aceptar
                      </Button>
                  </DialogActions>
              </Dialog> 
              <h2 className={classes.title}>{this.props.titulo}</h2>
              <Card className={this.props.cardName}>
                <CardContent>
                    <Grid container >
                        <input
                            id="contained-button-file"
                            accept="image/*"
                            className={classes.input}
                            multiple
                            type="file"
                            onChange={this.handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                          <Fab component="span" title="Subir Archivo" className={classes.button}>
                              <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '1.5em' }} />
                          </Fab>
                        </label>
                    </Grid>
                    <div className={classes.demo}>
                      <List dense subheader={<ListSubheader>Listado de Archivos asociados al Legajo</ListSubheader>} className={classes.subtitle}>
                        {this.state.archivos.map((data,index) =>
                          <ListItem key={data.id}>
                            <ListItemAvatar>
                              <Avatar>
                                { this.renderSwitch(data.archivo) }
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              onClick={e => {this.setState({ open_descripcion: true, a_editar: index, descripcion: data.descripcion ? data.descripcion : "" }) } }
                              primary={data.archivo}
                              secondary={data.descripcion ? data.descripcion : data.archivo}
                            />                              
                            <ListItemSecondaryAction>
                              <Link id={"dwn_"+data.id} className={classes.actionMargin} href={data.path} title="Descargar archivo" download>
                                <FontAwesomeIcon icon={faDownload} />
                              </Link>
                              <Link id={"del_"+data.id} className={classes.actionMargin} href={"#"} onClick={e => {this.setState({ open: true, a_borrar: index })}} title="Borrar archivo">
                                <FontAwesomeIcon icon={faTrash} />
                              </Link>
                              {/*<IconButton aria-label="download" title="Descargar archivo" onClick={this.handleDownload}>
                                <FontAwesomeIcon icon={faDownload} />
                              </IconButton>
                              <IconButton aria-label="delete" onClick={e => this.handleDelete(data.id)} title="Borrar archivo">
                                <FontAwesomeIcon icon={faTrash} />
                              </IconButton>*/}
                            </ListItemSecondaryAction>
                          </ListItem>
                        )
                        }
                      </List>
                    </div>
                </CardContent>
              </Card>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(FileUpload);