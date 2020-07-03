import React from 'react';
import { setUserSession } from '../utils/Commons';
import { Button, TextField, Grid, Card, CardHeader, CardContent } from '@material-ui/core';
import conn from '../ServiceConexion';

class Login extends React.Component {
    
    state = {
            usuario: '',
            clave: '',
            loading: false,
            error: null
        };

    handleFormSubmit = e => {
        conn.login(this.state.usuario, this.state.clave)
            .then( response => {
                                  if (response.data.error) {
                                      this.setState({error : response.data.error});
                                  }
                                  else {
                                      this.setState({loading:false});
                                      setUserSession(response.data.token, response.data.user, response.data.userid);
                                      const loggedIn = true;
                                      this.props.onLoggedIn(loggedIn);
                                  }
                               })
            .catch( error => { console.error(error) } );
    };


    render() {
        return (
            <div className="Login">
                <Card className="Card" >
                    <CardHeader color="#fff" title="Desarrollo Humano"  subheader="Inicio de Sesión"/>
                    <CardContent>
                        <Grid container spacing={3} item xs={12}>
                            <Grid item xs={12}>
                                <TextField id="txtUsuario" fullWidth name="usuario" label="Usuario" value={this.state.usuario} onChange={e => this.setState({ usuario: e.target.value })} ></TextField>
                            </Grid>   
                            <Grid item xs={12}> 
                                <TextField id="txtClave" fullWidth name="clave" type="password" label="Contraseña" value={this.state.clave} onChange={e => this.setState({ clave: e.target.value })} ></TextField>
                            </Grid>
                            {this.state.error && <><small style={{ color: 'red' }}>{ this.state.error }</small><br /></>}<br />
                            <Grid item xs={12}>   
                                <Button onClick={ this.handleFormSubmit } disabled={ this.state.loading }  variant="contained" className="LoginBtn" color="primary" >{ this.state.loading ? 'Cargando...' : 'Ingresar'}</Button>
                            </Grid>
                        </Grid>
                    </CardContent>    
                </Card>
            </div>
            );
    }
}
export default Login;