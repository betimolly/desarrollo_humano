import React from "react";
import { Tabs, Tab , AppBar, Card, CardContent } from '@material-ui/core';
import TabPanel from '../componentes/TabPanel';
import PersonaDatos from "../componentes/PersonaDatos";
import Listafamiliares from "../paginas/ListaFamiliares";
import conn from '../ServiceConexion';

class Persona extends React.Component {
    state = {
        id_pers: 0,
        data_familiares: [],
        tab_selected: 0
    };

    handleTab = (e, newval) => {
        this.setState ({tab_selected: newval});
    };

    handleChangePersona = (id) => {
        this.loadData(id);
    };

    loadData = async (id) => {
        let result = await conn.listafamiliares(id);
        this.setState( { data_familiares: result.data } );
    };

    async componentDidMount() {
        const id_pers = this.props.match.params.pers;
        if (this.props.match.params.pers) {
            this.setState({ id_pers: id_pers });
            await this.loadData(id_pers);
        }
    }

    render() {      
        return (
            <div className="App" >
                <Card className="Card" >
                    <CardContent>
                        <AppBar position="static" color="transparent">
                            <Tabs
                                value={this.state.tab_selected}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={this.handleTab}
                            >
                                <Tab label="Persona" ></Tab>
                                <Tab label="Familiares" ></Tab>
                            </Tabs>
                        </AppBar>
                        <TabPanel value={this.state.tab_selected} index={0} >
                            <PersonaDatos titulo="Persona" id_pers={this.state.id_pers} onChangePersona={this.handleChangePersona} />
                        </TabPanel>
                        <TabPanel value={this.state.tab_selected} index={1} >
                            <Listafamiliares titulo="Listado Familiares" data_familiares={this.state.data_familiares} />
                        </TabPanel>
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;