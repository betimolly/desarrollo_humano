import React from "react";
import { Grid, Card, CardContent } from '@material-ui/core';
//import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImage } from '@fortawesome/free-solid-svg-icons'
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
//import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
//import conn from '../ServiceConexion';

const styles = theme => ({
  /*root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end"
  },*/
  input: {
    display: "none"
  },
  button: {
    color: blue[900],
    margin: 10
  },
  /*
  icon: {
    margin: theme.spacing.unit * 2
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    "&:hover": {
      color: red[800]
    }
  },
  cardHeader: {
    textalign: "center",
    align: "center",
    backgroundColor: "white"
  },
  title: {
    color: blue[800],
    fontWeight: "bold",
    fontFamily: "Montserrat",
    align: "center"
  },
  secondaryButton: {
    color: "gray",
    margin: 10
  },
  typography: {
    margin: theme.spacing.unit * 2,
    backgroundColor: "default"
  },

  searchRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
  searchInput: {
    marginLeft: 8,
    flex: 1
  },
  searchIconButton: {
    padding: 10
  },
  searchDivider: {
    width: 1,
    height: 28,
    margin: 4
  },*/
  subTitle: {
    display: "flex",
    alignItems: "start"
  }
});

class FileUpload extends React.Component {

    state = {
        mainState: "initial", // initial, search, gallery, uploaded
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
        console.log(url); // Would see a path?

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
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={this.handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                        <Fab component="span" className={classes.button}>
                            {/*<AddPhotoAlternateIcon />*/}
                            <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '1.5em' }} />
                        </Fab>
                        </label>
                        {/*<Fab className={classes.button} onClick={this.handleSearchClick}>
                        <SearchIcon />
                        </Fab>
                        <Fab className={classes.button} onClick={this.handleGalleryClick}>
                        </Fab>*/}
                    </Grid>
                </CardContent>
              </Card>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(FileUpload);