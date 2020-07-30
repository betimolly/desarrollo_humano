import React from "react";
import { Grid, Card, CardContent } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage } from '@fortawesome/free-solid-svg-icons'
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
//import conn from '../ServiceConexion';

const styles = theme => ({
  input: {
    display: "none"
  },
  button: {
    color: blue[900],
    margin: 10
  },
  subTitle: {
    display: "flex",
    alignItems: "start"
  }
});

class FileUpload extends React.Component {

    state = {
        mainState: "initial", 
        imageUploaded: 0,
        selectedFile: null
    };
    
    handleUploadClick = event => {
        console.log();
        var file = event.target.files[0];
        const reader = new FileReader();
        var url = reader.readAsDataURL(file);

        reader.onloadend = function(e) {
          this.setState({
            selectedFile: [reader.result]
          });
        }.bind(this);
        console.log(url); 

        this.setState({
          mainState: "uploaded",
          selectedFile: event.target.files[0],
          imageUploaded: 1
        });
    };
    
    handleSearchClick = event => {
        this.setState({
          mainState: "search"
        });
    };
  
    handleGalleryClick = event => {
        this.setState({
          mainState: "gallery"
        });
    };


    render() {
      const { classes } = this.props;
        return (
            <React.Fragment>
              <h2 className={classes.subTitle}>{this.props.titulo}</h2>
              <Card className={this.props.cardName}>
                <CardContent>
                    <Grid container justify="center" alignItems="center">
                        <input
                            id="contained-button-file"
                            accept="image/*"
                            className={classes.input}
                            multiple
                            type="file"
                            onChange={this.handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                        <Fab component="span" className={classes.button}>
                            <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '1.5em' }} />
                        </Fab>
                        </label>
                    </Grid>
                </CardContent>
              </Card>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(FileUpload);