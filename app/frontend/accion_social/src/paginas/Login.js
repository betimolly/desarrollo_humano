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
                                      setUserSession(response.data.token, response.data.user);
                                      //this.props.history.push('/accion_social');
                                      const loggedIn = true;
                                      this.props.onLoggedIn(loggedIn);
                                  }
                               })
            .catch( error => { console.error(error) } );
    };


    render() {
        return (
            <div className="Login">
                {/*<h2>Acción Social - Inicio de Sesión</h2>*/}
                <Card className="Card" >
                    <CardHeader color="#fff" title="Acción Social - Inicio de Sesión" />
                    <CardContent>
                        <Grid container spacing={3} item xs={12}>
                            {/*<form onSubmit={this.handleSubmit}>*/}
                            <Grid item xs={12}>
                                <TextField id="txtUsuario" fullWidth name="usuario" label="Usuario" value={this.state.usuario} onChange={e => this.setState({ usuario: e.target.value })} ></TextField>
                            </Grid>   
                            <Grid item xs={12}> 
                                <TextField id="txtClave" fullWidth name="clave" type="password" label="Contraseña" value={this.state.clave} onChange={e => this.setState({ clave: e.target.value })} ></TextField>
                            </Grid>
                            {/*<label>Usuario</label>
                            <input type="text" id="txtUsuario" name="usuario" placeholder="Usuario" value={this.state.usuario} onChange={e => this.setState({ usuario: e.target.value })}/>
                            <label>Contraseña</label>
                            <input type="password" id="txtClave" name="clave" placeholder="Contraseña" value={this.state.clave} onChange={e => this.setState({ clave: e.target.value })} />*/}
                            {/*<input type="button" value="Ingresar" onClick={e => this.handleFormSubmit(e)} />*/}
                    
                
                            {this.state.error && <><small style={{ color: 'red' }}>{ this.state.error }</small><br /></>}<br />
                            {/*<input type="button" value={ this.state.loading ? 'Cargando...' : 'Ingresar'} onClick={ this.handleFormSubmit } disabled={ this.state.loading } /><br />*/}
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