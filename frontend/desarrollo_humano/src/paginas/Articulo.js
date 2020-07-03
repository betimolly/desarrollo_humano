import React from "react";
import { Tabs, Tab , AppBar, Card, CardContent } from '@material-ui/core';
import TabPanel from '../componentes/TabPanel';
import ArticuloDatos from "./ArticuloDatos";
import ModuloArticulo from "./ModuloArticulo";
import conn from '../ServiceConexion';

class Articulo extends React.Component {
    
    state = {
        id_art: 0,
        id_rubro: 0,
        load_articulos_modulo: 0,
        tab_selected: 0
    };

    handleTab = (e, newval) => {
        this.setState ({tab_selected: newval});
    };

    handleRubroChange = (id_rubro) => {
        this.setState ({id_rubro: id_rubro});
    };

    handleAfterSave = (id_art) => {
        if (this.state.id_rubro === 1) {
            this.setState ({ tab_selected: 1 })
        }
    }
 
    componentDidMount() {
        if (this.props.match.params.art !== 0) {
            this.setState({ id_art: this.props.match.params.art }); 
        }

        conn.searchexactarticulo(this.props.match.params.art).then( response => {
            if ((!response.data.error) && (response.data.length>0)) {
                this.setState( { id_rubro: response.data[0].id_rubro } );
            }
        }).catch( error => { console.error(error) } ); 
    }
   
    render() {
        //Verifico si es un módulo o si es un artículo simple. Rubro 1 es MODULO
        //if (this.state.id_rubro === 1) {
            return (
                <div className="App" >
                    <Card className="Card" >
                        <CardContent>
                            {(this.state.id_rubro === 1) && <AppBar position="static" color="transparent">
                                <Tabs
                                    value={this.state.tab_selected}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleTab}
                                >
                                    <Tab label="Artículo" ></Tab>
                                    <Tab label="Artículos que lo Componen" ></Tab>
                                </Tabs>
                            </AppBar>}
                            <TabPanel value={this.state.tab_selected} index={0} >
                                <ArticuloDatos titulo="Artículo" id_art={this.state.id_art} onAfterSave={this.handleAfterSave} onRubroChange={this.handleRubroChange} />
                            </TabPanel>
                            {(this.state.id_rubro === 1) && <TabPanel value={this.state.tab_selected} index={1} >
                                <ModuloArticulo titulo="Artículos que lo Componen" id_art={this.state.id_art} />
                            </TabPanel>}
                        </CardContent>                    
                    </Card>
                </div>
            )                
        /*}
        else {
            return (
                <div className="App" >
                    <Card className="Card" >
                        <CardContent>
                            <ArticuloDatos titulo="Artículo" id_art={this.state.id_art} id_rubro={this.state.id_rubro} onRubroChange={this.handleRubroChange} />
                        </CardContent>                    
                    </Card>
                </div>
            )  
        }*/
    }
}

export default Articulo;